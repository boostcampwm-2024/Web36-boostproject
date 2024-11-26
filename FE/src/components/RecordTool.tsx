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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'

import {
  TableType,
  RecordToolType,
  RecordToolColumnType,
} from '@/types/interfaces'
import { RECORD_TYPES } from '@/constants/constants'
import { generateKey, convertTableDataToRecordToolData } from '@/util'
import TagInputForm from '@/components/TagInputForm'

export default function RecordTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const [tables, setTables] = useState<RecordToolType[]>([])
  const [selectedTable, setSelectedTable] = useState<RecordToolType>({
    tableName: '',
    columns: [],
  })

  useEffect(() => {
    const recordToolData = convertTableDataToRecordToolData(tableData)
    setTables(recordToolData)
    setSelectedTable(recordToolData[0] || { tableName: '', columns: [] })
  }, [tableData])

  const handleOnChange = (
    row: number,
    id: keyof RecordToolColumnType,
    value: unknown
  ) => {
    const updatedTables = tables.map((table) => {
      if (table.tableName !== selectedTable.tableName) return table

      const updatedColumns = table.columns.map((col, colIdx) => {
        if (colIdx !== row) return col

        const updatedValue = Array.isArray(value)
          ? [...(Array.isArray(col[id]) ? col[id] : []), ...value]
          : value

        return { ...col, [id]: updatedValue }
      })
      return { ...table, columns: updatedColumns }
    })

    setTables(updatedTables)
    const updatedSelectedTable = updatedTables.find(
      (table) => table.tableName === selectedTable.tableName
    )
    if (updatedSelectedTable) setSelectedTable(updatedSelectedTable)
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
                    handleOnChange(rowIdx, 'type', newValue)
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
                <Input
                  type="number"
                  id="row"
                  className="mr-2 h-8 w-12 p-1"
                  placeholder="0"
                />
                <span>%</span>
              </TableCell>
              <TableCell>
                {row.type === 'number' && (
                  <div className="flex">
                    <Input
                      type="number"
                      id="row"
                      className="mr-2 h-8 w-16 p-2"
                      placeholder="min"
                    />
                    <Input
                      type="number"
                      id="row"
                      className="h-8 w-16 p-2"
                      placeholder="max"
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
                          handleOnChange(rowIdx, 'enum', newEnum)
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
          placeholder="max 100,000"
          className="h-8 w-28 p-2"
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button variant="default" className="ml-3 h-8">
          Add Random Data
        </Button>
      </div>
    </>
  )
}
