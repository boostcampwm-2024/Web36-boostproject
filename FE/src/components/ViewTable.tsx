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
import { TableType } from '@/types/interfaces'
import generateKey from '@/util'
import { Check } from 'lucide-react'

export default function ViewTable({ tableData }: { tableData: TableType[] }) {
  const [selectedTable, setSelectedTable] = useState(tableData[0])

  return (
    <>
      <div className="sticky top-0 items-center gap-3 border-b p-2">
        {tableData?.map((table) => (
          <Badge
            variant={
              selectedTable.tableName === table.tableName
                ? 'default'
                : 'secondary'
            }
            className="mr-2 cursor-pointer"
            onClick={() => {
              setSelectedTable(table)
            }}
            key={table.tableName}
          >
            {table.tableName}
          </Badge>
        ))}
      </div>
      {selectedTable.columns && selectedTable.columns?.length > 0 && (
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              {Object.keys(selectedTable.columns[0])?.map((header) => (
                <TableHead key={generateKey(header)}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTable.columns.map((row) => (
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
