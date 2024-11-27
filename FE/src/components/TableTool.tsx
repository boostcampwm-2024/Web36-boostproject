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
import { Plus, X } from 'lucide-react'

import { v4 as uuidv4 } from 'uuid'
import useShellHandlers from '@/hooks/useShellHandler'
import {
  TableType,
  TableToolType,
  TableToolColumnType,
} from '@/types/interfaces'
import { COLUMN_TYPES } from '@/constants/constants'
import {
  generateKey,
  convertTableDataToTableToolData,
  generateCreateTableQuery,
  generateAlterTableQuery,
} from '@/util'
import EditableInput from './EditableInput'

export default function TableTool({
                                    tableData = [],
                                  }: {
  tableData: TableType[]
}) {
  const { addShell, updateShell } = useShellHandlers()
  const initialTableData = useRef<TableToolType[]>([])
  const [tables, setTables] = useState<TableToolType[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string>('')
  const [newTableName, setNewTableName] = useState('')

  useEffect(() => {
    const tableToolData = convertTableDataToTableToolData(tableData)
    initialTableData.current = tableToolData
    setTables(tableToolData)
    setSelectedTableName(tableToolData[0]?.tableName)
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

  const handleAddTable = () => {
    const newTable: TableToolType = {
      tableName: newTableName,
      columns: [],
    }

    setTables((prev) => [...prev, newTable])
    setNewTableName('')
    setSelectedTableName(newTableName)
  }

  const handleAddRow = () => {
    if (!selectedTable) return
    selectedTable?.columns.push({
      id: uuidv4(),
      name: 'new_column',
      type: 'VARCHAR(255)',
      PK: false,
      UQ: false,
      AI: false,
      NN: false,
    })

    setTables((prevTables) =>
        prevTables.map((table) =>
            table.tableName === selectedTable.tableName ? selectedTable : table
        )
    )
  }

  const handleDeleteRow = (id: string) => {
    if (!selectedTable) return

    const updatedColumns = selectedTable.columns.filter(
        (column) => column.id !== id
    )

    const updatedTable = {
      ...selectedTable,
      columns: updatedColumns,
    }

    setTables((prevTables) =>
        prevTables.map((table) =>
            table.tableName === selectedTable.tableName ? updatedTable : table
        )
    )
  }

  const handleSubmit = async () => {
    if (!selectedTable) return

    const previousTable = initialTableData.current.find(
        (table) => table.tableName === selectedTableName
    )

    const query = previousTable
        ? generateAlterTableQuery(previousTable, selectedTable)
        : generateCreateTableQuery(selectedTable)

    const { id } = await addShell()
    await updateShell({ id, query })
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
              <TableHead>Del</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>PK</TableHead>
              <TableHead>UQ</TableHead>
              <TableHead>AI</TableHead>
              <TableHead>NN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable?.columns.map((row: TableToolColumnType, rowIdx) => (
                <TableRow key={generateKey(row.id)}>
                  <TableCell>
                    <button
                        type="button"
                        className="mr-1 h-3"
                        onClick={() => handleDeleteRow(row.id)}
                    >
                      <X className="h-4" />
                    </button>
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
                                      <SelectTrigger className="h-8 w-32 p-2">
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
        <div className="flex justify-end p-2">
          <Button
              variant="outline"
              size="icon"
              className="mr-1 h-8"
              onClick={handleAddRow}
          >
            <Plus />
          </Button>
        </div>
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