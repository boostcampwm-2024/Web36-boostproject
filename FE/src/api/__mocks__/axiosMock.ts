import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import shellDataRaw from '@/api/__mocks__/mocdata.json'

const shellData: ShellType[] = shellDataRaw.result

const axiosInstance = axios.create()
const mock = new MockAdapter(axiosInstance)

// fetch
mock.onGet('/shells').reply(200, shellData)

// add
mock.onPost('/shells').reply((config) => {
  const newShell: ShellType = JSON.parse(config.data)
  newShell.shellId = new Date().getTime()
  shellData.push(newShell)
  return [200, newShell.shellId]
})

// delete
mock.onDelete(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const index = shellData.findIndex((shell) => shell.shellId === id)

  if (index === -1) return [404, { error: 'Shell not found' }]

  shellData.splice(index, 1)
  return [200, id]
})

mock.onPut(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const newQuery = config.data
  const changedShell = shellData.find((shell) => shell.shellId === id)

  if (!changedShell) return [404, { error: 'Shell not found' }]

  changedShell.query = config.data
  return [200, { id, newQuery }]
})

export default axiosInstance
