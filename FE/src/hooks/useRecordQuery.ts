import useCustomMutation from '@/hooks/useCustomMutation'
import addRecord from '@/api/recordApi'
import { RecordToolType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants/constants'

export default function useAddRecord() {
  return useCustomMutation<RecordToolType, RecordToolType>(
    addRecord,
    QUERY_KEYS.RECORD
  )
}
