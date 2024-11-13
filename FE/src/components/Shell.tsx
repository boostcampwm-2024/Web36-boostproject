import React, { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import PlayCircle from '@/assets/play_circle.svg'
import { ShellType } from '@/types/interfaces'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { X } from 'lucide-react'

interface ShellProps {
  shell: ShellType
  removeShell: (shellId: number) => void
  updateShell: (shell: ShellType) => void
  focusedShell: number | null
  setFocusedShell: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Shell({
  shell,
  removeShell,
  updateShell,
  focusedShell,
  setFocusedShell,
}: ShellProps) {
  const {
    shellId,
    queryStatus,
    runTime,
    query,
    queryType,
    failMessage,
    affectedRows,
    table,
  } = shell

  const [inputValue, setInputValue] = useState(query ?? '')
  const prevQueryRef = useRef<string>('')

  const successMessage = `Query OK ${affectedRows} affected (${runTime} sec)`

  const handleBlur = () => {
    if (inputValue === prevQueryRef.current) return
    updateShell({ ...shell, query: inputValue })
    prevQueryRef.current = inputValue
  }

  return (
    <>
      <div className="flex h-12 w-full items-center overflow-hidden rounded-sm bg-secondary">
        <button type="button" className="mr-3 h-full w-12 bg-primary p-3">
          <img src={PlayCircle} alt="play button" />
        </button>
        <input
          type="text"
          defaultValue={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocusedShell(shellId)}
          onBlur={handleBlur}
          className="h-8 w-full border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
        />
        {focusedShell === shellId && shellId != null && (
          <X
            className="mr-3 fill-current"
            onClick={() => removeShell(shellId)}
          />
        )}
      </div>
      {queryType != null && ( // 쉘 실행 결과가 있는가?
        <div className="flex w-full flex-col overflow-hidden overflow-x-auto rounded-sm bg-secondary">
          {queryStatus ? (
            <p className="m-3 text-green-500">{successMessage}</p>
          ) : (
            <p className="m-3 text-red-500">{failMessage}</p>
          )}
          {queryType === 'SELECT' &&
            table !== null && ( // 결과 테이블이 있는지
              <>
                <Table className="m-3">
                  <TableHeader>
                    {Object.keys(table[0]).map((header) => (
                      <TableHead key={uuidv4()}>{header}</TableHead>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.map((row) => (
                      <TableRow key={uuidv4()}>
                        {Object.values(row).map((cell) => (
                          <TableCell key={uuidv4()}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <button
                  type="button"
                  className="flex w-full justify-center bg-primary"
                >
                  <div className="text-bold w-3 text-background">+</div>
                </button>
              </>
            )}
        </div>
      )}
    </>
  )
}
