import { useMutation, useQueryClient } from 'react-query'
import addRecord from '@/api/recordApi'
import { RecordToolType, RecordResultType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants/constants'

export default function useAddRecord() {
  const queryClient = useQueryClient()

  return useMutation<RecordResultType, Error, RecordToolType>({
    mutationFn: addRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.RECORD)
    },
    onError: (error) => {
      console.error('Error inserting record:', error)
    },
  })
}
