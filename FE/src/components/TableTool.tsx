import { useState, useRef, useEffect } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Plus, Minus } from 'lucide-react'

import {
  TableType,
  TableToolType,
  TableToolColumnType,
} from '@/types/interfaces'
import { COLUMN_TYPES } from '@/constants'
import {
  generateKey,
  convertTableData,
  generateCreateTableQuery,
  generateAlterTableQuery,
} from '@/util'
import EditableInput from './EditableInput'

export default function TableTool({
  tableData = [],
}: {
  tableData: TableType[]
}) {
  const initialTableData = useRef<TableToolType[]>([])
  const [tables, setTables] = useState<TableToolType[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string>('')
  const [newTableName, setNewTableName] = useState('')

  useEffect(() => {
    const tableToolData = convertTableData(tableData)
    initialTableData.current = tableToolData
    setTables(tableToolData)
    setSelectedTableName(tableToolData[0]?.tableName)
  }, [tableData])

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

  const handleAddTable = () => {
    const newTable: TableToolType = {
      tableName: newTableName,
      columns: [],
    }

    setTables((prev) => [...prev, newTable])
    setNewTableName('')
    setSelectedTableName(newTableName)
  }

  const handleSubmit = () => {
    const selectedTable = tables.find(
      (table) => table.tableName === selectedTableName
    )
    if (!selectedTable) return

    const previousTable = initialTableData.current.find(
      (table) => table.tableName === selectedTableName
    )

    const query = previousTable
      ? generateAlterTableQuery(previousTable, selectedTable)
      : generateCreateTableQuery(selectedTable)

    console.log(previousTable, query)
  }

  const selectedTable = tables.find(
    (table) => table.tableName === selectedTableName
  )

  return (
    <>
      <div className="sticky top-0 items-center gap-3 border-b p-2">
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
      {selectedTable?.columns && selectedTable.columns.length > 0 && (
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead />
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>PK</TableHead>
              <TableHead>UQ</TableHead>
              <TableHead>AI</TableHead>
              <TableHead>NN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.columns.map((row: TableToolColumnType, rowIdx) => (
              <TableRow key={generateKey(row)}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                {Object.entries(row).map(
                  ([key, value]) =>
                    key !== 'id' && (
                      <TableCell key={generateKey(value)}>
                        {key === 'name' && (
                          <EditableInput
                            value={String(value)}
                            rowIdx={rowIdx}
                            handleOnChange={handleOnChange}
                          />
                        )}

                        {typeof value === 'boolean' && (
                          <Checkbox
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleOnChange(rowIdx, key, checked)
                            }
                          />
                        )}

                        {key === 'type' && (
                          <Select
                            value={value}
                            onValueChange={(newValue) =>
                              handleOnChange(rowIdx, 'type', newValue)
                            }
                          >
                            <SelectTrigger className="h-[32px] w-[120px] p-2">
                              <SelectValue placeholder={value} />
                            </SelectTrigger>
                            <SelectContent>
                              {COLUMN_TYPES.map((types) => (
                                <SelectItem value={types} key={types}>
                                  {types}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-end p-2">
        <Button variant="outline" size="icon" className="mr-1 h-8">
          <Plus />
        </Button>
        <Button variant="outline" size="icon" className="h-8">
          <Minus />
        </Button>
      </div>
      <div className="mt-8 flex justify-center">
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
                <Button type="submit" onClick={handleAddTable}>
                  Add
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="default" className="ml-3 h-8" onClick={handleSubmit}>
          Generate Query
        </Button>
      </div>
    </>
  )
}
