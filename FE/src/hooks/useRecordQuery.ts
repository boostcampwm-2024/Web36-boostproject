import { useMutation, useQueryClient } from 'react-query'
import addRecord from '@/api/recordApi'
import { RecordToolType, RecordResultType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants/constants'
import useToastErrorHandler from '@/error/toastErrorHandler'

export default function useAddRecord() {
  const handleToastError = useToastErrorHandler()
  const queryClient = useQueryClient()
  return useMutation<RecordResultType, Error, RecordToolType>({
    mutationFn: addRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.RECORD)
    },
    onError: (error) => {
      console.error('Error inserting record:', error)
      handleToastError(error)
    },
  })
}
