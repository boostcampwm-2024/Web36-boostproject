import axiosClient from '@/api/axiosClient'
import axiosMock from '@/api/__mocks__/axiosMock'
import { RecordToolType } from '@/types/interfaces'

const axiosInstance =
  import.meta.env.VITE_NODE_ENV === 'development' ? axiosMock : axiosClient

export default async function addRecord(record: RecordToolType) {
  const response = await axiosInstance.post('/record', record)
  return response.data.data
}
