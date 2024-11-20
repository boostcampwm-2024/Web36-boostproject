import axiosClient from '@/api/axiosClient'
import axiosMock from '@/api/__mocks__/axiosMock'

const axiosInstance =
  import.meta.env.VITE_NODE_ENV === 'development' ? axiosMock : axiosClient

export async function fetchTables() {
  const response = await axiosInstance.get('/tables')
  return response.data.data
}

export async function fetchTablesByName(tableName: string) {
  const response = await axiosInstance.get(`/tables/${tableName}`)
  return response.data.data
}
