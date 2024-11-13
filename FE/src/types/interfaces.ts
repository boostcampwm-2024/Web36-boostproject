type TableRow = {
  [key: string]: string
}

export interface ShellType {
  shellId: number | null
  queryStatus: boolean | null
  runTime: string | null
  query: string | null
  queryType: string | null
  failMessage: string | null
  affectedRows: number | null
  table: TableRow[] | null
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
