type QueryType =
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'ALTER'
  | 'CREATE'
  | 'DROP'
  | null

type TableRow = {
  [key: string]: string
}

export default interface ShellType {
  shellId: number
  queryStatus: boolean | null
  runTime: string | null
  query: string | null
  queryType: QueryType
  failMessage: string | null
  affectedRows: number | null
  table: TableRow[] | null
}
