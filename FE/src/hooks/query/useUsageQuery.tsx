import { useQuery } from 'react-query'
import { UsageType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants/constants'
import fetchUsage from '@/api/usageApi'

export default function useUsages() {
  return useQuery<UsageType>(QUERY_KEYS.USAGES, fetchUsage, {
    refetchOnWindowFocus: false,
  })
}
