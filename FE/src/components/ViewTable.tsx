import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TableType, TableColumnType } from '@/types/interfaces'
import { generateKey } from '@/util'
import { Check } from 'lucide-react'
import { useTableByName } from '@/hooks/query/useTableQuery'

export default function ViewTable({ tableData }: { tableData: TableType[] }) {
  const [selectedTableName, setSelectedTableName] = useState(
    tableData.length > 0 ? tableData[0].tableName : null
  )

  const selectedTable = useTableByName(selectedTableName)

  if (!tableData || tableData.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center border px-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">No table</h1>
          <p className="my-4 text-sm">No table data available</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="sticky top-0 items-center gap-3 border-b p-2">
        {tableData?.map((table) => (
          <Badge
            variant={
              selectedTableName === table.tableName ? 'default' : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => {
              setSelectedTableName(table.tableName)
            }}
            key={table.tableName}
          >
            {table.tableName}
          </Badge>
        ))}
      </div>
      {selectedTable.data?.columns && (
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              {Object.keys(selectedTable.data.columns[0])?.map((header) => (
                <TableHead key={generateKey(header)}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.data.columns.map((row: TableColumnType) => (
              <TableRow key={generateKey(row)}>
                {Object.values(row).map((cell) => (
                  <TableCell key={generateKey(cell)}>
                    {cell === null && '-'}
                    {cell === true && <Check className="w-4 text-primary" />}
                    {typeof cell === 'string' && cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
