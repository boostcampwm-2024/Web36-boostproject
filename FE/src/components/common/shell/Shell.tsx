import { useState, useRef, useEffect } from 'react'
import { useQueryClient } from 'react-query'

import PlayCircle from '@/assets/play_circle.svg'
import { ShellType } from '@/types/interfaces'
import useShellHandlers from '@/hooks/useShellHandler'
import { X } from 'lucide-react'
import { useTables } from '@/hooks/query/useTableQuery'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import useUsages from '@/hooks/query/useUsageQuery'
import ResultTable from '@/components/common/ResultTable'
import { QUERY_KEYS } from '@/constants/constants'

type ShellProps = {
  shell: ShellType
}

export default function Shell({ shell }: ShellProps) {
  const { id, queryStatus, query, text, queryType, resultTable } = shell

  const queryClient = useQueryClient()
  const { refetch: tableRefetch } = useTables()
  const { refetch: usageRefetch } = useUsages()
  const { executeShell, updateShell, deleteShell } = useShellHandlers()

  const LINE_HEIGHT = 1.2

  const prevQueryRef = useRef<string>(query ?? '')
  const [isExecuting, setIsExecuting] = useState(false)
  const [focused, setFocused] = useState(true)
  const [inputValue, setInputValue] = useState(query ?? '')
  const [editorHeight, setEditorHeight] = useState(LINE_HEIGHT)
  const editorRef = useRef<AceEditor>(null)

  useEffect(() => {
    setInputValue(shell.query ?? '')
  }, [shell.query])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer = editorRef.current?.editor.renderer as any
    if (renderer) {
      if (!focused) {
        renderer.$cursorLayer.element.style.display = 'none'
      } else {
        editorRef.current?.editor.focus()
        renderer.$cursorLayer.element.style.display = ''
      }
    }
  }, [focused])

  const handleFocus = () => {
    setFocused(true)
    editorRef.current?.editor.container.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (e.relatedTarget?.id === 'remove-shell-btn') return
    setFocused(false)
    if (inputValue === prevQueryRef.current || shell.id === null) return
    try {
      updateShell({ id: shell.id, query: inputValue })
    } catch (error) {
      throw new Error(`Failed to update shell with id, ${shell.id}`)
    }
    prevQueryRef.current = inputValue
  }

  const handleClick = async () => {
    if (!id || !shell) throw new Error(`Invalid shell or id, ${id}`)

    setIsExecuting(true)
    try {
      await executeShell({ ...shell, query })
    } catch (error) {
      throw new Error(`Failed to execute shell with id, ${id}`)
    } finally {
      setIsExecuting(false)
    }

    try {
      if (!queryType || ['CREATE', 'ALTER', 'DROP'].includes(queryType || '')) {
        await tableRefetch()
        queryClient.invalidateQueries(QUERY_KEYS.TABLES)
      }
    } catch (error) {
      throw new Error('Failed to refetch tables after shell execution.')
    }

    try {
      if (
        !queryType ||
        !['CREATE', 'ALTER', 'SELECT'].includes(queryType || '')
      )
        usageRefetch()
    } catch (error) {
      throw new Error('Failed to refetch usages tables after shell execution.')
    }
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
      <div className="flex h-auto overflow-hidden rounded-sm bg-secondary shadow-md">
        <button
          type="button"
          className="relative h-full w-14 bg-primary p-3 shadow-lg"
          onClick={handleClick}
          disabled={inputValue.length === 0 || isExecuting}
        >
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            {isExecuting ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <img
                src={PlayCircle}
                alt="play button"
                className={`h-6 w-6 ${inputValue.length === 0 ? 'opacity-50' : ''} `}
              />
            )}
          </div>
        </button>
        <div className="editor-container h-full w-full rounded-sm bg-secondary">
          <style>{`.ace_placeholder {margin: 0;}`}</style>
          <AceEditor
            ref={editorRef}
            placeholder="쿼리를 입력하세요"
            mode="sql"
            value={inputValue}
            onChange={handleEditorChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            fontSize={14}
            width="100%"
            height={`${editorHeight}rem`}
            setOptions={{
              showGutter: false,
              useWorker: false,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              tabSize: 2,
              wrap: true,
              behavioursEnabled: false,
              highlightActiveLine: false,
              cursorStyle: 'slim',
            }}
            onLoad={(editor) => {
              setEditorHeight(
                editor.getSession().getScreenLength() * LINE_HEIGHT
              )
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
          {resultTable && resultTable?.length > 0 && (
            <ResultTable data={resultTable} />
          )}
        </div>
      )}
    </>
  )
}
