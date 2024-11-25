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
import { RECORD_TYPES } from '@/constants'
import { generateKey, convertTableDataToRecordToolData } from '@/util'

export default function RecordTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const [tables, setTables] = useState<RecordToolType[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string>('')
  const [newTableName, setNewTableName] = useState('')

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

  //   const handleSubmit = async () => {
  //     if (!selectedTable) return
  //   }

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
            <TableHead>Type</TableHead>
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
                  <SelectTrigger className="h-8 w-32 p-2">
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
              <TableCell />
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-5 flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="h-8">
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Table</DialogTitle>
              <DialogDescription>write table name</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Tablename
              </Label>
              <Input
                id="username"
                value={newTableName}
                placeholder="table name"
                className="col-span-3"
                onChange={(e) => setNewTableName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Add</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="default" className="ml-3 h-8">
          Generate Query
        </Button>
      </div>
    </>
  )
}
