// import axiosClient from '@/api/axiosClient'
import { ShellType } from '@/types/interfaces'
import axiosInstance from '@/api/__mocks__/axiosMock'

export async function fetchShells() {
  const response = await axiosInstance.get('/shells')
  return response.data
}

export async function addShell(shell: ShellType) {
  const response = await axiosInstance.post('/shells', {
    shellId: shell.shellId,
  })
  return { ...response.data, shell }
}

export async function deleteShell(shellId: number) {
  const response = await axiosInstance.delete(`/shells/${shellId}`)
  return response.data
}

export async function updateShell(shell: ShellType) {
  const response = await axiosInstance.put(
    `/shells/${shell.shellId}`,
    shell.query
  )
  return response.data
}
