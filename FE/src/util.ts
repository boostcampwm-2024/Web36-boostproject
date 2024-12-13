import { v4 as uuidv4 } from 'uuid'
import { TableType, TableToolType, RecordToolType } from '@/types/interfaces'
import { COLUMN_TYPES } from '@/constants/constants'

export function generateKey(data: Record<string, unknown> | unknown) {
  if (data !== null && typeof data === 'object' && 'id' in data)
    return `${data.id}-${uuidv4()}`
  return `${JSON.stringify(data)}-${uuidv4()}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractMessages(errors: any): string[] {
  if (!errors) return []
  if ('message' in errors) return [errors.message]
  return Object.values(errors).flatMap(extractMessages)
}

export function convertTableDataToTableToolData(
  tableData: TableType[]
): TableToolType[] {
  const getNormalizedType = (value: string): string => {
    const baseType = value.toUpperCase().split('(')[0]
    const matchedType = COLUMN_TYPES.find((type) => type.startsWith(baseType))
    return matchedType ?? value
  }

  return tableData.map((table) => ({
    tableName: table.tableName,
    columns: table.columns.map((column) => ({
      id: uuidv4(),
      name: column.name,
      type: getNormalizedType(column.type),
      PK: column.PK,
      UQ: column.UQ,
      AI: column.AI,
      NN: column.NN,
    })),
  }))
}

export function convertTableDataToRecordToolData(
  tableData: TableType[]
): RecordToolType[] {
  return tableData.map((table) => ({
    tableName: table.tableName,
    columns: table.columns.map((column) => ({
      name: column.name,
      type: 'default',
      blank: 0,
      min: 0,
      max: 0,
      enum: [],
    })),
    count: 0,
  }))
}

export function generateCreateTableQuery(table: TableToolType): string {
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
  previousTable: TableToolType,
  currentTable: TableToolType
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
