import { useState, useRef } from 'react'
import PlayCircle from '@/assets/play_circle.svg'
import { ShellType } from '@/types/interfaces'
import { useExecuteShell } from '@/hooks/useShellQuery'
import generateKey from '@/util'
import { X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTables } from '@/hooks/useTableQuery'

interface ShellProps {
  shell: ShellType
  removeShell: (id: number) => void
  updateShell: (shell: ShellType) => void
}

export default function Shell({ shell, removeShell, updateShell }: ShellProps) {
  const { id, queryStatus, query, text, queryType, resultTable } = shell

  const { refetch } = useTables()

  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState(query ?? '')

  const prevQueryRef = useRef<string>(query ?? '')
  const executeShellMutation = useExecuteShell()

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.relatedTarget?.id === 'remove-shell-btn') return
    setFocused(false)
    if (inputValue === prevQueryRef.current) return
    updateShell({ ...shell, query: inputValue })
    prevQueryRef.current = inputValue
  }

  const handleClick = async () => {
    if (!id) return
    await executeShellMutation.mutateAsync({ ...shell, query })
    if (!queryType || ['CREATE', 'ALTER', 'DROP'].includes(queryType || ''))
      await refetch()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Blur 이벤트 방지
    if (id) removeShell(id)
  }

  const handleOutput = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <>
      <div className="flex min-h-[2rem] w-full items-center overflow-hidden rounded-sm bg-secondary">
        <button
          type="button"
          className="mr-3 h-full w-12 bg-primary p-3 disabled:cursor-not-allowed"
          onClick={handleClick}
          disabled={inputValue.length === 0}
        >
          <img
            src={PlayCircle}
            alt="play button"
            className={`${inputValue.length === 0 ? 'opacity-50' : ''}`}
          />
        </button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          rows={1}
          onInput={handleOutput}
          className="min-h-[2rem] w-full resize-none overflow-auto border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
        />
        {focused && (
          <button
            type="button"
            id="remove-shell-btn"
            className="mr-3 cursor-pointer fill-current"
            onMouseDown={handleMouseDown}
          >
            <X />
          </button>
        )}
      </div>
      {text && ( // 쉘 실행 결과가 있는가?
        <div className="flex w-full flex-col overflow-hidden overflow-x-auto rounded-sm bg-secondary">
          <p
            className={`m-3 ${queryStatus ? 'text-green-500' : 'text-red-500'}`}
          >
            {text}
          </p>
          {resultTable &&
            resultTable?.length > 0 && ( // 결과 테이블이 있는지
              <>
                <Table className="m-3">
                  <TableHeader>
                    <TableRow>
                      {Object.keys(resultTable[0])?.map((header) => (
                        <TableHead key={generateKey(header)}>
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultTable.map((row) => (
                      <TableRow key={generateKey(row)}>
                        {Object.values(row).map((cell) => (
                          <TableCell key={generateKey(cell)}>
                            {String(cell)}
                          </TableCell>
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
