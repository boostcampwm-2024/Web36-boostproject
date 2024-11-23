import { Table2, FileText, Network } from 'lucide-react'

const QUERY_KEYS = {
  SHELLS: 'shells',
  TABLES: 'tables',
} as const

const MENU_TITLE = {
  TABLE: 'Create/Edit Table',
  RECORD: 'Add Random Record',
  VIEW: 'Current Table',
}

const MENU = [
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
    title: MENU_TITLE.VIEW,
    icon: Network,
    isActive: false,
  },
]

const COLUMN_TYPES = [
  'TINYINT',
  'SMALLINT',
  'MEDIUMINT',
  'INT',
  'BIGINT',
  'BIT(1)',
  'FLOAT',
  'DOUBLE',
  'DECIMAL(10,0)',
  'CHAR(1)',
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
]

export { MENU, MENU_TITLE, QUERY_KEYS, COLUMN_TYPES }
