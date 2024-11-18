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
  const response = await axiosInstance.post('/shells', shell)
  return { ...response.data.data, shell }
}

export async function deleteShell(id: number) {
  const response = await axiosInstance.delete(`/shells/${id}`)
  return response.data.data
}

export async function updateShell(shell: ShellType) {
  const response = await axiosInstance.put(`/shells/${shell.id}`, {
    query: shell.query,
  })
  return response.data.data
}

export async function executeShell(shell: ShellType) {
  const response = await axiosInstance.post(`/shells/${shell.id}/execute`, {
    query: shell.query,
  })
  return { ...shell, ...response.data.data }
}
