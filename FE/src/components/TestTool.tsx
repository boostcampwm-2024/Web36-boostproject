import { useState } from 'react'
import { Button } from '@/components/ui/button'
import useShellHandlers from '@/hooks/useShellHandler'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'

export default function TestQueryTool() {
  const createQueryExample = `CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,       -- 고유 ID, 기본 키
  name VARCHAR(100) NOT NULL,              -- 이름
  city VARCHAR(100) NOT NULL,              -- 도시
  email VARCHAR(255) UNIQUE NOT NULL,      -- 이메일, 고유값
  phone VARCHAR(20) NOT NULL,              -- 전화번호
  age INT CHECK (age >= 0),                -- 나이 (0 이상만 허용)
  gender ENUM('Male', 'Female', 'Other') NOT NULL,  -- 성별 (열거형)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- 생성 날짜
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 수정 날짜
);`

  const insertQueryExample = `INSERT INTO users (name, city, email, phone, age, gender)
VALUES
('Alice Johnson', 'New York', 'alice.johnson@example.com', '123-456-7890', 30, 'Female'),
('Bob Smith', 'Los Angeles', 'bob.smith@example.com', '987-654-3210', 45, 'Male'),
('Charlie Brown', 'Chicago', 'charlie.brown@example.com', '555-555-5555', 25, 'Other');
`

  const selectQueryExample = `SELECT * FROM users;`

  const testQueries = [
    {
      id: 'create',
      name: 'Create Table Query',
      query: createQueryExample,
    },
    {
      id: 'insert',
      name: 'Insert Row Query',
      query: insertQueryExample,
    },
    {
      id: 'select',
      name: 'Select Row Query',
      query: selectQueryExample,
    },
  ]

  const { addShell, updateShell } = useShellHandlers()
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const [hoveredQuery, setHoveredQuery] = useState<string | null>(null)
  const [queryInput, setQueryInput] = useState<string>('')

  const handleSelectQuery = (id: string) => {
    setSelectedQueryId(id)
    setHoveredQuery(null)
    const selectedQuery = testQueries.find((q) => q.id === id)?.query || ''
    setQueryInput(selectedQuery) // 선택 시 쿼리 내용을 상태에 저장
  }

  const handleRunQuery = async () => {
    if (!selectedQueryId) {
      alert('Please select a query first.')
      return
    }

    const { id } = await addShell()
    await updateShell({ id, query: queryInput })
  }

  return (
    <div className="mt-5 shadow-sm">
      <style>
        {`
    .editor-hovered .ace_line,
    .editor-hovered .ace_string,
    .editor-hovered .ace_keyword,
    .editor-hovered .ace_numeric,
    .editor-hovered .ace_comment,
    .editor-hovered .ace_constant,
    .editor-hovered .ace_type {
      color: rgba(0, 0, 0, 0.5) !important; /* 반투명한 텍스트 */
    }
  `}
      </style>
      {/* Query List */}
      <div className="mb-4">
        <p
          id="query-list-label"
          className="block flex h-10 items-center border-b border-t bg-secondary pl-3 text-sm font-medium text-muted-foreground transition-colors"
        >
          Select Query
        </p>
        <div
          id="query-list"
          className="space-y-2"
          role="listbox"
          aria-labelledby="query-list-label"
        >
          {testQueries.map((query) => (
            <div
              key={query.id}
              className={`m-3 cursor-pointer rounded border p-2 ${
                selectedQueryId === query.id
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSelectQuery(query.id)}
              onMouseEnter={() => setHoveredQuery(query.query)}
              onMouseLeave={() => setHoveredQuery(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSelectQuery(query.id)
                }
              }}
              role="option"
              aria-selected={selectedQueryId === query.id}
              tabIndex={0}
            >
              {query.name}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Query Display */}
      <div className="mb-4">
        <p
          id="selected-query-label"
          className="mb-3 block flex h-10 items-center border-b border-t bg-secondary pl-3 text-sm font-medium text-muted-foreground transition-colors"
        >
          Preview / Edit Query
        </p>
        <AceEditor
          placeholder="쿼리를 입력하거나 수정하세요"
          mode="sql"
          value={hoveredQuery || queryInput || 'No query selected.'}
          onChange={(value) => setQueryInput(value)}
          fontSize={12}
          width="100%"
          height="200px"
          setOptions={{
            highlightActiveLine: true,
            showGutter: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            tabSize: 2,
            wrap: true,
          }}
          className={`bg-gray-100 ${hoveredQuery ? 'editor-hovered' : ''}`}
        />
      </div>

      {/* Action Button */}
      <div className="px-4">
        <Button onClick={handleRunQuery} variant="default" className="w-full">
          Add Query
        </Button>
      </div>
    </div>
  )
}
