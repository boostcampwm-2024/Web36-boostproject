import { useQuery } from 'react-query'
import { TableType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants'
import { fetchTables, fetchTablesByName } from '@/api/tableApi'

export function useTables() {
  return useQuery<TableType[]>(QUERY_KEYS.tables, fetchTables, {
    refetchOnWindowFocus: false,
  })
}

export function useTableByName(tableName: string | null) {
  return useQuery(
    [QUERY_KEYS.tables, tableName],
    () => fetchTablesByName(tableName!),
    {
      refetchOnWindowFocus: false,
      enabled: !!tableName,
    }
  )
}
