import { useState, useRef, useEffect } from 'react'
import PlayCircle from '@/assets/play_circle.svg'
import { ShellType } from '@/types/interfaces'
import useShellHandlers from '@/hooks/useShellHandler'
import { generateKey } from '@/util'
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
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'

type ShellProps = {
  shell: ShellType
}

export default function Shell({ shell }: ShellProps) {
  const { id, queryStatus, query, text, queryType, resultTable } = shell
  const { refetch } = useTables()
  const { executeShell, updateShell, deleteShell } = useShellHandlers()

  const LINE_HEIGHT = 1.2

  const prevQueryRef = useRef<string>(query ?? '')
  const [focused, setFocused] = useState(false)
  const [inputValue, setInputValue] = useState(query ?? '')
  const [editorHeight, setEditorHeight] = useState(LINE_HEIGHT)
  const editorRef = useRef<AceEditor>(null)

  useEffect(() => {
    setInputValue(shell.query ?? '')
  }, [shell.query])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer = editorRef.current?.editor.renderer as any
    renderer.$cursorLayer.element.style.display = !focused ? 'none' : ''
  }, [focused])

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.relatedTarget?.id === 'remove-shell-btn') return
    setFocused(false)
    if (inputValue === prevQueryRef.current || shell.id === null) return
    updateShell({ id: shell.id, query: inputValue })
    prevQueryRef.current = inputValue
  }

  const handleClick = async () => {
    if (!id) return
    await executeShell({ ...shell, query })
    if (!queryType || ['CREATE', 'ALTER', 'DROP'].includes(queryType || ''))
      await refetch()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // Blur 이벤트 방지
    if (id) deleteShell(id)
  }

  const handleEditorChange = (value: string) => {
    if (value === inputValue) return
    setInputValue(value)
  }
  return (
    <>
      <div className="flex overflow-hidden rounded-sm bg-secondary shadow-md">
        <button
          type="button"
          className="h-full bg-primary p-3 shadow-lg"
          onClick={handleClick}
          disabled={inputValue.length === 0}
        >
          <img
            src={PlayCircle}
            alt="play button"
            className={`${inputValue.length === 0 ? 'opacity-50' : ''} `}
          />
        </button>
        <div className="h-full w-full rounded-sm bg-secondary">
          <style>{`.ace_placeholder {margin: 0;}`}</style>
          <AceEditor
            ref={editorRef}
            placeholder="쿼리를 입력하세요"
            mode="sql"
            value={inputValue}
            onChange={handleEditorChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            fontSize={14}
            width="100%"
            height={`${editorHeight}rem`}
            setOptions={{
              highlightActiveLine: false,
              showGutter: false,
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              tabSize: 2,
              wrap: true,
              behavioursEnabled: false,
            }}
            onLoad={(editor) => {
              editor.on('change', () => {
                setEditorHeight(
                  editor.getSession().getScreenLength() * LINE_HEIGHT
                )
              })
            }}
            className="my-3.5 ml-2 bg-secondary"
          />
        </div>
        {focused && (
          <button
            type="button"
            id="remove-shell-btn"
            className="h-full cursor-pointer bg-secondary px-2 text-blue-950"
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
