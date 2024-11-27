import axiosClient from '@/api/axiosClient'
import axiosMock from '@/api/__mocks__/axiosMock'
import { UsageType } from '@/types/interfaces'

const axiosInstance =
  import.meta.env.VITE_NODE_ENV === 'development' ? axiosMock : axiosClient

export default async function fetchUsage(): Promise<UsageType> {
  const response = await axiosInstance.get('/usage')
  return response.data.data
}
