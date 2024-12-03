import { useState } from 'react'
import { generateKey } from '@/util'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function ResultTable<T extends Record<string, unknown>>({
  data,
}: {
  data: T[]
}) {
  const ITEMS_PER_PAGE = 10

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const visibleData = data.slice(0, visibleCount)

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE)
  }

  return (
    <div className="w-full">
      <Table className="">
        <TableHeader>
          <TableRow>
            {data?.length > 0 &&
              Object.keys(data[0]).map((header) => (
                <TableHead
                  className="border-b border-t border-gray-300 text-muted-foreground"
                  key={header}
                >
                  {header}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleData.map((row) => (
            <TableRow
              className="border-b border-t border-gray-300"
              key={generateKey(row)}
            >
              {Object.values(row).map((cell) => (
                <TableCell key={generateKey(cell)}>{String(cell)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visibleCount < data.length && (
        <button
          type="button"
          className="mt-3 flex w-full justify-center bg-primary"
          onClick={handleLoadMore}
        >
          <div className="text-bold w-3 text-background">+</div>
        </button>
      )}
    </div>
  )
}

export default ResultTable
