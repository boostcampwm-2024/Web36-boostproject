/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'
import TagInputForm from '@/components/common/TagInputForm'

import { TableType, RecordToolType, RecordResultType } from '@/types/interfaces'
import { RECORD_TYPES } from '@/constants/constants'
import { convertTableDataToRecordToolData, extractMessages } from '@/util'
import useAddRecord from '@/hooks/query/useRecordQuery'
import useUsages from '@/hooks/query/useUsageQuery'

import { z } from 'zod'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRandomRecordDtoSchema } from '@schemas/record'

type CreateRandomRecordDto = z.infer<typeof CreateRandomRecordDtoSchema>
type RecordType = (typeof RECORD_TYPES)[number]

export default function RecordTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const { toast } = useToast()
  const addRecordMutation = useAddRecord()
  const { refetch: usageRefetch } = useUsages()

  const [recordToolData, setRecordToolData] = useState<RecordToolType[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string>(
    tableData[0]?.tableName || ''
  )

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRandomRecordDto>({
    resolver: zodResolver(CreateRandomRecordDtoSchema),
    defaultValues: {
      tableName: '',
      columns: [],
      count: 0,
    },
  })

  const { fields, replace } = useFieldArray({
    control,
    name: 'columns',
  })

  useEffect(() => {
    const convertedData = convertTableDataToRecordToolData(tableData)
    setRecordToolData(convertedData)

    if (convertedData.length > 0) {
      const firstTable = convertedData[0]
      setSelectedTableName(firstTable.tableName)
      setValue('tableName', firstTable.tableName)
      replace(firstTable.columns)
    }
  }, [tableData, setValue, replace])

  const handleTableChange = (tableName: string) => {
    const selectedTable = recordToolData.find(
      (table) => table.tableName === tableName
    )

    if (!selectedTable) throw new Error('Cannot find table')

    setSelectedTableName(selectedTable.tableName)
    setValue('tableName', selectedTable.tableName)

    replace(selectedTable.columns)
  }

  const handleSubmitRecord = async (data: CreateRandomRecordDto) => {
    try {
      const result: RecordResultType = await addRecordMutation.mutateAsync(data)
      usageRefetch()
      toast({
        title: 'Data inserted successfully',
        description: result.text,
      })
      reset({
        tableName: selectedTableName,
        columns: fields,
        count: 0,
      })
    } catch (error) {
      throw new Error('Failed to submit record.')
    }
  }

  return (
    <>
      <div className="sticky top-0 min-h-10 items-center gap-3 border-b p-2">
        {recordToolData.map((table) => (
          <Badge
            variant={
              selectedTableName === table.tableName ? 'default' : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => handleTableChange(table.tableName)}
            key={table.tableName}
          >
            {table.tableName}
          </Badge>
        ))}
      </div>
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Blank</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields?.map((fieldData, rowIdx) => (
            <TableRow key={fieldData.id}>
              <TableCell>{fieldData.name}</TableCell>

              <TableCell>
                <Controller
                  name={`columns.${rowIdx}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(newValue: RecordType) => {
                        if (!RECORD_TYPES.includes(newValue)) return
                        field.onChange(newValue)
                        replace(
                          fields.map(({ id, ...col }, idx) => ({
                            ...col,
                            type: idx === rowIdx ? newValue : col.type,
                          }))
                        )
                      }}
                    >
                      <SelectTrigger className="h-8 w-20 p-2">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {RECORD_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </TableCell>

              <TableCell className="flex items-center">
                <Controller
                  name={`columns.${rowIdx}.blank`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="0"
                      className="mr-2 h-8 w-12 p-1"
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === '' ? 0 : Number(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  )}
                />
                <span>%</span>
              </TableCell>

              <TableCell>
                {fieldData.type === 'number' && (
                  <div className="flex">
                    <Controller
                      name={`columns.${rowIdx}.min`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="min"
                          className="mr-2 h-8 w-12 p-1"
                          value={field.value === 0 ? '' : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === '' ? 0 : Number(e.target.value)
                            field.onChange(value)
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`columns.${rowIdx}.max`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="max"
                          className="h-8 w-12 p-1"
                          value={field.value === 0 ? '' : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === '' ? 0 : Number(e.target.value)
                            field.onChange(value)
                          }}
                        />
                      )}
                    />
                  </div>
                )}
                {fieldData.type === 'enum' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="h-8">
                        Add Enum
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Enum</DialogTitle>
                        <DialogDescription>write Enum</DialogDescription>
                      </DialogHeader>
                      <TagInputForm
                        type="enum"
                        preTag={fieldData.enum || []}
                        onAdd={(newEnum) => {
                          const updatedColumns = fields.map((col, idx) =>
                            idx === rowIdx ? { ...col, enum: newEnum } : col
                          )
                          replace(updatedColumns)
                        }}
                      >
                        <DialogFooter className="pt-3">
                          <DialogClose asChild>
                            <Button type="submit">Save</Button>
                          </DialogClose>
                        </DialogFooter>
                      </TagInputForm>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex items-center px-3">
        <Label htmlFor="Rows" className="pr-3">
          Rows
        </Label>
        <Controller
          name="count"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              id="Rows"
              placeholder="max 1,000,000"
              className="h-8 w-32 p-2"
              value={field.value === 0 ? '' : field.value}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : Number(e.target.value)
                field.onChange(value)
              }}
            />
          )}
        />
      </div>
      <div className="mt-8 flex justify-center text-xs text-red-500">
        {extractMessages(errors)[0]}
      </div>
      <div className="mt-2 flex justify-center">
        <Button
          variant="default"
          className="ml-3 h-8"
          onClick={handleSubmit(handleSubmitRecord)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'submitting' : 'Add Random Data'}
        </Button>
      </div>
    </>
  )
}
