import { v4 as uuidv4 } from 'uuid'

export default function generateKey(data: Record<string, unknown> | unknown) {
  if (data !== null && typeof data === 'object' && 'id' in data)
    return `${data.id}-${uuidv4()}`
  return `${JSON.stringify(data)}-${uuidv4()}`
}

interface Column {
  id: string
  name: string
  type: string
  PK: boolean
  UQ: boolean
  AI: boolean
  NN: boolean
}

interface Table {
  tableName: string
  columns: Column[]
}

export function generateCreateTableQuery(table: Table): string {
  const { tableName, columns } = table

  const columnDefinitions = columns.map((column) => {
    const parts = []

    parts.push(`\`${column.name}\` ${column.type}`)
    if (column.PK) parts.push('PRIMARY KEY')
    if (column.UQ) parts.push('UNIQUE')
    if (column.AI) parts.push('AUTO_INCREMENT')
    if (column.NN) parts.push('NOT NULL')
    return parts.join(' ')
  })
  return `CREATE TABLE \`${tableName}\` (\n  ${columnDefinitions.join(',\n  ')}\n);`
}

export function generateAlterTableQuery(
  previousTable: Table,
  currentTable: Table
): string {
  const { tableName } = currentTable
  const previousColumns = previousTable.columns
  const currentColumns = currentTable.columns

  const alterQueries: string[] = []

  previousColumns.forEach((prevCol) => {
    const existsInCurrent = currentColumns.find((col) => col.id === prevCol.id)
    if (!existsInCurrent) {
      alterQueries.push(`DROP COLUMN \`${prevCol.name}\``)
    }
  })

  currentColumns.forEach((currCol) => {
    const previousCol = previousColumns.find((col) => col.id === currCol.id)

    if (!previousCol) {
      const parts = [`\`${currCol.name}\` ${currCol.type}`]
      if (currCol.NN) parts.push('NOT NULL')
      if (currCol.AI) parts.push('AUTO_INCREMENT')
      if (currCol.UQ) parts.push('UNIQUE')
      alterQueries.push(`ADD COLUMN ${parts.join(' ')}`)
    } else {
      const modifications: string[] = []

      if (previousCol.name !== currCol.name) {
        modifications.push(
          `CHANGE COLUMN \`${previousCol.name}\` \`${currCol.name}\` ${currCol.type}`
        )
      }

      if (
        previousCol.type !== currCol.type ||
        previousCol.NN !== currCol.NN ||
        previousCol.AI !== currCol.AI ||
        previousCol.UQ !== currCol.UQ
      ) {
        const parts = [`\`${currCol.name}\` ${currCol.type}`]
        if (currCol.NN) parts.push('NOT NULL')
        if (currCol.AI) parts.push('AUTO_INCREMENT')
        if (currCol.UQ) parts.push('UNIQUE')
        modifications.push(`MODIFY COLUMN ${parts.join(' ')}`)
      }

      alterQueries.push(...modifications)
    }
  })

  const query = `ALTER TABLE \`${tableName}\`\n  ${alterQueries.join(',\n  ')};`

  return alterQueries.length > 0
    ? query.trim()
    : `-- No changes detected for table \`${tableName}\`.`
}
