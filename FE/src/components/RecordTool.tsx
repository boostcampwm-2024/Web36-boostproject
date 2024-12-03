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
import InputWithLocalState from '@/components/common/InputWithLocalState'

import { TableType, RecordToolType, RecordResultType } from '@/types/interfaces'
import { RECORD_TYPES } from '@/constants/constants'
import { generateKey, convertTableDataToRecordToolData } from '@/util'
import useAddRecord from '@/hooks/query/useRecordQuery'
import useUsages from '@/hooks/query/useUsageQuery'

import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  RandomColumnInfoSchema,
  CreateRandomRecordDtoSchema,
} from '@schemas/record'

type RandomColumnInfo = z.infer<typeof RandomColumnInfoSchema>
type CreateRandomRecordDto = z.infer<typeof CreateRandomRecordDtoSchema>

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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRandomRecordDto>({
    resolver: zodResolver(CreateRandomRecordDtoSchema),
    defaultValues: {
      tableName: '',
      columns: [] as RandomColumnInfo[],
      count: 0,
    },
  })

  const watchColumns = watch('columns')

  useEffect(() => {
    const convertedData = convertTableDataToRecordToolData(tableData)
    setRecordToolData(convertedData)

    if (convertedData.length > 0) {
      const firstTable = convertedData[0]
      setSelectedTableName(firstTable.tableName)
      setValue('tableName', firstTable.tableName)
      setValue('columns', firstTable.columns, { shouldValidate: true })
    }
  }, [tableData, setValue])

  const handleTableChange = (tableName: string) => {
    const selectedTable = recordToolData.find(
      (table) => table.tableName === tableName
    )

    if (!selectedTable) throw new Error('Cannot find table')

    setSelectedTableName(selectedTable.tableName)
    setValue('tableName', selectedTable.tableName)
    setValue('columns', selectedTable.columns, { shouldValidate: true })
  }

  const handleSubmitRecord = async (data: CreateRandomRecordDto) => {
    try {
      const result: RecordResultType = await addRecordMutation.mutateAsync(data)
      usageRefetch()
      toast({
        title: 'Data inserted successfully',
        description: result.text,
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
          {watchColumns?.map((row, rowIdx) => (
            <TableRow key={generateKey(row)}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Controller
                  name={`columns.${rowIdx}.type`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-8 w-20 p-2">
                        <SelectValue placeholder={row.type} />
                      </SelectTrigger>
                      <SelectContent>
                        {RECORD_TYPES.map((types) => (
                          <SelectItem value={types} key={types}>
                            {types}
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
                    <InputWithLocalState
                      value={field.value}
                      onChange={(newValue) => field.onChange(Number(newValue))}
                      type="number"
                      className="mr-2 h-8 w-12 p-1"
                      placeholder="0"
                    />
                  )}
                />
                <span>%</span>
              </TableCell>
              <TableCell>
                {row.type === 'number' && (
                  <div className="flex">
                    <Controller
                      name={`columns.${rowIdx}.min`}
                      control={control}
                      render={({ field }) => (
                        <InputWithLocalState
                          value={field.value}
                          onChange={(newValue) =>
                            field.onChange(Number(newValue))
                          }
                          type="number"
                          className="mr-2 h-8 w-12 p-1"
                          placeholder="min"
                        />
                      )}
                    />
                    <Controller
                      name={`columns.${rowIdx}.max`}
                      control={control}
                      render={({ field }) => (
                        <InputWithLocalState
                          value={field.value}
                          onChange={(newValue) =>
                            field.onChange(Number(newValue))
                          }
                          type="number"
                          className="mr-2 h-8 w-12 p-1"
                          placeholder="max"
                        />
                      )}
                    />
                  </div>
                )}
                {row.type === 'enum' && (
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
                        preTag={row.enum || []}
                        onAdd={(newEnum) => {
                          const updatedColumns = watch('columns').map(
                            (col, idx) =>
                              idx === rowIdx ? { ...col, enum: newEnum } : col
                          )
                          setValue('columns', updatedColumns, {
                            shouldValidate: true,
                          })
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
              placeholder="max 100,000"
              className="h-8 w-28 p-2"
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          )}
        />
      </div>
      <div className="mt-8 flex justify-center text-xs text-red-500">
        {Object.values(errors).length > 0 && Object.values(errors)[0]?.message}
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
