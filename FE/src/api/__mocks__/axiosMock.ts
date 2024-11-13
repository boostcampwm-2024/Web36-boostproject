import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import getMocResult from '@/api/__mocks__/util'
import shellDataRaw from '@/api/__mocks__/mocData.json'

const shellData: ShellType[] = shellDataRaw.result

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

// fetch
mock.onGet('/shells').reply(200, shellData)

// add
mock.onPost('/shells').reply((config) => {
  const newShell: ShellType = JSON.parse(config.data)
  newShell.shellId = new Date().getTime()
  shellData.push(newShell)
  return [200, newShell.shellId]
})

// execute
mock.onPost(/^\/shells(\/\d+\/execute)?$/).reply((config) => {
  const id = parseInt(config.url!.split('/')[1], 10)
  let executeddShell = shellData.find((shell) => shell.shellId === id)

  if (!executeddShell) return [404, { error: 'Shell not found' }]
  const result = getMocResult(executeddShell)
  executeddShell = { ...executeddShell, ...result }

  return [200, result]
})

// delete
mock.onDelete(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const index = shellData.findIndex((shell) => shell.shellId === id)

  if (index === -1) return [404, { error: 'Shell not found' }]

  shellData.splice(index, 1)
  return [200, id]
})

// put
mock.onPut(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const newQuery = config.data
  const changedShell = shellData.find((shell) => shell.shellId === id)

  if (!changedShell) return [404, { error: 'Shell not found' }]
  changedShell.query = config.data

  return [200, { id, newQuery }]
})

export default axiosMock
