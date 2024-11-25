type TableRow = {
  [key: string]: unknown // key는 string, value는 어떤 타입도 가능
}

export interface ShellType {
  id: number | null
  queryStatus: boolean | null
  queryType: string | null
  query: string | null
  text: string | null
  resultTable: TableRow[] | null
}

export interface TableType {
  tableName: string
  columns: TableColumnType[]
}

export interface TableColumnType {
  name: string
  type: string
  FK: string | null
  PK: boolean
  IDX: boolean
  UQ: boolean
  AI: boolean
  NN: boolean
}

export interface TableToolType {
  tableName: string
  columns: TableToolColumnType[]
}

export interface TableToolColumnType {
  id: string
  name: string
  type: string
  PK: boolean
  UQ: boolean
  AI: boolean
  NN: boolean
}

export interface RecordToolType {
  tableName: string
  columns: RecordToolColumnType[]
}

export interface RecordToolColumnType {
  name: string
  type: string
  blank: number
  min: number
  max: number
  enum: string[]
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
