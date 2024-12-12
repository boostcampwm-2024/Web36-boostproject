import { Table2, FileText, Network, AlignLeft } from 'lucide-react'

export const QUERY_KEYS = {
  SHELLS: 'shells',
  TABLES: 'tables',
  USAGES: 'usages',
  RECORD: 'record',
} as const

export const MENU_TITLE = {
  TABLE: 'Create/Edit Table',
  RECORD: 'Add Random Record',
  TESTQUERY: 'Add Example Query',
  VIEW: 'Current Table',
}

export const MENU = [
  {
    title: MENU_TITLE.TABLE,
    icon: Table2,
    isActive: true,
  },
  {
    title: MENU_TITLE.RECORD,
    icon: FileText,
    isActive: false,
  },
  {
    title: MENU_TITLE.TESTQUERY,
    icon: AlignLeft,
    isActive: false,
  },
  {
    title: MENU_TITLE.VIEW,
    icon: Network,
    isActive: false,
  },
]

export const MAX_ROWS_PER_USER = 500000

export const COLUMN_TYPES = [
  'TINYINT',
  'SMALLINT',
  'MEDIUMINT',
  'INT',
  'BIGINT',
  'BIT(1)',
  'FLOAT',
  'DOUBLE',
  'DECIMAL(10,0)',
  'CHAR(255)',
  'VARCHAR(255)',
  'TINYTEXT',
  'TEXT',
  'MEDIUMTEXT',
  'LONGTEXT',
  'BINARY(1)',
  'VARBINARY(255)',
  'TINYBLOB',
  'BLOB',
  'MEDIUMBLOB',
  'LONGBLOB',
  'JSON',
  'DATE',
  'DATETIME',
  'TIMESTAMP',
  'TIME',
  'YEAR',
] as const

export const RECORD_TYPES = [
  'default',
  'name',
  'country',
  'city',
  'email',
  'phone',
  'sex',
  'boolean',
  'number',
  'enum',
] as const
