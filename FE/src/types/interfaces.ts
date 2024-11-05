export default interface ShellType {
  shellId: number
  queryStatus: boolean | null
  runTime: string | null
  query: string | null
  queryType:
    | 'CREATE'
    | 'ALTER'
    | 'DROP'
    | 'INSERT'
    | 'UPDATE'
    | 'DELETE'
    | 'SELECT'
    | null
  failMessage: string | null
  affectedRows: number | null
  table: { string: string }[] | [] | null
}
