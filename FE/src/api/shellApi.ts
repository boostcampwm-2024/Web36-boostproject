import axiosClient from '@/api/axiosClient'
import axiosMock from '@/api/__mocks__/axiosMock'
import { ShellType } from '@/types/interfaces'

const axiosInstance =
  import.meta.env.VITE_NODE_ENV === 'development' ? axiosMock : axiosClient

export async function fetchShells() {
  const response = await axiosInstance.get('/shells')
  return response.data.data
}

export async function addShell(shell: ShellType) {
  const response = await axiosInstance.post('/shells')
  return { ...shell, id: response.data.data }
}

export async function deleteShell(id: number) {
  const response = await axiosInstance.delete(`/shells/${id}`)
  return response.data.data
}

export async function updateShell({
  id,
  query,
}: {
  id: number
  query: string
}) {
  const response = await axiosInstance.put(`/shells/${id}`, {
    query,
  })
  return response.data.data
}

export async function executeShell(shell: ShellType) {
  const response = await axiosInstance.post(`/shells/${shell.id}/execute`, {
    query: shell.query,
  })
  return { ...shell, ...response.data.data }
}
