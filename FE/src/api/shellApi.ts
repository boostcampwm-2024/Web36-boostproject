import axiosClient from '@/api/axiosClient'
import ShellType from '@/types/interfaces'

export async function fetchShells() {
  const response = await axiosClient.get('/shells')
  return response.data
}

export async function addShell(shell: ShellType) {
  const response = await axiosClient.post('/shells', { shellId: shell.shellId })
  return response.data
}

export async function deleteShell(shellId: number) {
  const response = await axiosClient.delete(`/shells/${shellId}`)
  return response.data
}

export async function updateShell(shellId: number, query: string) {
  const response = await axiosClient.put(`/shells/${shellId}`, { query })
  return response.data
}

export async function saveShellTable(shellId: number, table: unknown[]) {
  const response = await axiosClient.post(`/shells/${shellId}/table`, { table })
  return response.data
}
