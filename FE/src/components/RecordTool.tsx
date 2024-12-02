/* eslint-disable jsx-a11y/label-has-associated-control */
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

import {
  TableType,
  RecordToolType,
  RecordToolColumnType,
  RecordResultType,
} from '@/types/interfaces'
import { RECORD_TYPES } from '@/constants/constants'
import { generateKey, convertTableDataToRecordToolData } from '@/util'
import TagInputForm from '@/components/TagInputForm'
import InputWithLocalState from '@/components/InputWithLocalState'
import useAddRecord from '@/hooks/query/useRecordQuery'
import useUsages from '@/hooks/query/useUsageQuery'

export default function RecordTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const { toast } = useToast()
  const addRecordMutation = useAddRecord()
  const { refetch: usageRefetch } = useUsages()

  const [tables, setTables] = useState<RecordToolType[]>([])
  const [selectedTable, setSelectedTable] = useState<RecordToolType>({
    tableName: '',
    columns: [],
    count: 0,
  })

  useEffect(() => {
    const recordToolData = convertTableDataToRecordToolData(tableData)
    setTables(recordToolData)
    setSelectedTable(recordToolData[0] || { tableName: '', columns: [] })
  }, [tableData])

  const addRecord = async (record: RecordToolType): Promise<RecordResultType> =>
    addRecordMutation.mutateAsync(record)

  const handleColumnChange = (
    row: number,
    id: keyof RecordToolColumnType,
    value: unknown
  ) => {
    const updatedColumns = selectedTable.columns.map((col, colIdx) =>
      colIdx !== row ? col : { ...col, [id]: value }
    )

    const updatedSelectedTable = {
      ...selectedTable,
      columns: updatedColumns,
    }
    setSelectedTable(updatedSelectedTable)

    setTables((prevTables) =>
      prevTables.map((table) =>
        table.tableName === updatedSelectedTable.tableName
          ? updatedSelectedTable
          : table
      )
    )
  }

  const handleCountChange = (count: number) => {
    const updatedSelectedTable = { ...selectedTable, count }

    setSelectedTable(updatedSelectedTable)

    setTables((prevTables) =>
      prevTables.map((table) =>
        table.tableName === updatedSelectedTable.tableName
          ? updatedSelectedTable
          : table
      )
    )
  }

  const handleSubmitRecord = async () => {
    const result: RecordResultType = await addRecord(selectedTable)
    usageRefetch()
    toast({
      title: 'Data inserted successfully',
      description: result.text,
    })
  }

  return (
    <>
      <div className="sticky top-0 min-h-10 items-center gap-3 border-b p-2">
        {tables.map((table) => (
          <Badge
            variant={
              selectedTable.tableName === table.tableName
                ? 'default'
                : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => setSelectedTable(table)}
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
          {selectedTable?.columns.map((row: RecordToolColumnType, rowIdx) => (
            <TableRow key={generateKey(row.name)}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                <Select
                  value={row.type}
                  onValueChange={(newValue) =>
                    handleColumnChange(rowIdx, 'type', newValue)
                  }
                >
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
              </TableCell>
              <TableCell className="flex items-center">
                <InputWithLocalState<number>
                  type="number"
                  id={`row-blank-${rowIdx}`}
                  className="mr-2 h-8 w-12 p-1"
                  placeholder="0"
                  value={row.blank}
                  onChange={(updatedValue) =>
                    handleColumnChange(rowIdx, 'blank', Number(updatedValue))
                  }
                />
                <span>%</span>
              </TableCell>
              <TableCell>
                {row.type === 'number' && (
                  <div className="flex">
                    <label
                      htmlFor={`row-min-${rowIdx}`}
                      className="mr-2 flex items-center"
                    >
                      min
                    </label>
                    <InputWithLocalState<number>
                      type="number"
                      id={`row-min-${rowIdx}`}
                      className="mr-2 h-8 w-16 p-2"
                      placeholder="min"
                      value={row.min}
                      onChange={(updatedValue) =>
                        handleColumnChange(rowIdx, 'min', Number(updatedValue))
                      }
                    />
                    <label
                      htmlFor={`row-max-${rowIdx}`}
                      className="mr-2 flex items-center"
                    >
                      max
                    </label>
                    <InputWithLocalState<number>
                      type="number"
                      id={`row-max-${rowIdx}`}
                      className="h-8 w-16 p-2"
                      placeholder="max"
                      value={row.max}
                      onChange={(updatedValue) =>
                        handleColumnChange(rowIdx, 'max', Number(updatedValue))
                      }
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
                        preTag={row.enum}
                        onAdd={(newEnum) =>
                          handleColumnChange(rowIdx, 'enum', newEnum)
                        }
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
        <Input
          type="number"
          id="Rows"
          value={selectedTable.count === 0 ? '' : selectedTable.count}
          placeholder="max 100,000"
          className="h-8 w-28 p-2"
          onChange={(e) => handleCountChange(Number(e.target.value))}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          variant="default"
          className="ml-3 h-8"
          onClick={handleSubmitRecord}
        >
          Add Random Data
        </Button>
      </div>
    </>
  )
}
