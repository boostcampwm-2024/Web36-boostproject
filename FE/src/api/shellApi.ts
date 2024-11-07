import axiosClient from '@/api/axiosClient'

export const fetchShells = async () => {
  const response = await axiosClient.get('/shells')
  return response.data
}

export const addShell = async (shellId: number) => {
  const response = await axiosClient.post('/shells', {
    shellId,
  })
  return response.data
}

export const deleteShell = async (shellId: number) => {
  const response = await axiosClient.delete(`/shells/${shellId}`)
  return response.data
}

export const updateShell = async (shellId: number, query: string) => {
  const response = await axiosClient.put(`/shells/${shellId}`, { query })
  return response.data
}

export const saveShellTable = async (shellId: number, table: unknown[]) => {
  const response = await axiosClient.post(`/shells/${shellId}/table`, { table })
  return response.data
}
