type TableRow = {
  [key: string]: unknown // key는 string, value는 어떤 타입도 가능
}

export interface ShellType {
  id: number | null // 추후 number로 변경 필요
  queryStatus: boolean | null
  runTime: string | null
  query: string | null
  queryType: string | null
  failMessage: string | null
  affectedRows: number | null
  resultTable: TableRow[] | null
}

export type QueryType =
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'ALTER'
  | 'CREATE'
  | 'DROP'
  | null
