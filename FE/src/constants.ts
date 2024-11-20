import { Table2, FileText, Network } from 'lucide-react'

const QUERY_KEYS = {
  shells: 'shells',
  tables: 'tables',
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

export { MENU, MENU_TITLE, QUERY_KEYS }
