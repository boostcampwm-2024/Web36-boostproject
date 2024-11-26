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

export default function RecordTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const [tables, setTables] = useState<RecordToolType[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string>('')

  useEffect(() => {
    const recordToolData = convertTableDataToRecordToolData(tableData)
    setTables(recordToolData)
    setSelectedTableName(recordToolData[0]?.tableName)
  }, [tableData])

  const selectedTable = tables.find(
    (table) => table.tableName === selectedTableName
  )

  const handleOnChange = (row: number, id: string, value: unknown) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.tableName === selectedTableName
          ? {
              ...table,
              columns: table.columns.map((col, colIdx) =>
                colIdx === row ? { ...col, [id]: value } : col
              ),
            }
          : table
      )
    )
  }

  return (
    <>
      <div className="sticky top-0 min-h-10 items-center gap-3 border-b p-2">
        {tables.map((table) => (
          <Badge
            variant={
              selectedTableName === table.tableName ? 'default' : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => setSelectedTableName(table.tableName)}
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
                <Input type="number" id="row" className="mr-2 h-8 w-12 p-1" />
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
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Enum
                        </Label>
                        <Input
                          id="username"
                          placeholder="write enum"
                          className="col-span-3"
                          onChange={(e) => e.target.value}
                        />
                        <Button type="submit" variant="secondary">
                          Add
                        </Button>
                      </div>
                      <div className="sticky top-0 min-h-10 items-center gap-3 border-b p-2">
                        {row.enum.map((enumText) => (
                          <Badge
                            variant="default"
                            className="mr-2 cursor-pointer"
                            key={generateKey(enumText)}
                          >
                            {enumText}
                          </Badge>
                        ))}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="submit">Save</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex items-center px-3">
        <Label htmlFor="row" className="pr-3">
          Rows
        </Label>
        <Input
          type="number"
          id="row"
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
