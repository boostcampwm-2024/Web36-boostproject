type TableRow = {
  [key: string]: any // key는 string, value는 어떤 타입도 가능
}

export interface ShellType {
  id?: string | null
  queryStatus?: boolean | null
  runTime?: string | null
  query?: string | null
  queryType?: string | null
  failMessage?: string | null
  affectedRows?: number | null
  resultTable?: TableRow[] | null
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
