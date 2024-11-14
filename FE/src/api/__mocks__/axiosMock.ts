import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import getMocResult from '@/api/__mocks__/util'
import shellDataRaw from '@/api/__mocks__/mocData.json'

const shellData: ShellType[] = shellDataRaw.result.map((shell) => ({
  ...shell,
  id: String(shell.id), // 초기 데이터에서도 id를 string으로 변환
}))

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

// fetch
mock.onGet('/shells').reply(200, shellData)

// add
mock.onPost('/shells').reply((config) => {
  const newShell: ShellType = JSON.parse(config.data)
  newShell.id = String(new Date().getTime()) // id를 string으로 변환
  shellData.push(newShell)
  return [200, newShell.id]
})

// execute
mock.onPost(/^\/shells(\/\d+\/execute)?$/).reply((config) => {
  const id = config.url!.split('/')[2]
  const executeddShell = shellData.find((shell) => shell.id === id)
  const index = shellData.findIndex((shell) => shell.id === id)

  if (!executeddShell) return [404, { error: 'Shell not found' }]
  const result = getMocResult(executeddShell)

  shellData.splice(index, 1, { ...executeddShell, ...result })
  return [200, result]
})

// delete
mock.onDelete(/\/shells\/\d+/).reply((config) => {
  const id = config.url!.split('/').pop()!
  const index = shellData.findIndex((shell) => shell.id === id)

  if (index === -1) return [404, { error: 'Shell not found' }]

  shellData.splice(index, 1)
  return [200, id]
})

// put
mock.onPut(/\/shells\/\d+/).reply((config) => {
  const id = config.url!.split('/').pop()!
  const newQuery = config.data
  const changedShell = shellData.find((shell) => shell.id === id)

  if (!changedShell) return [404, { error: 'Shell not found' }]
  changedShell.query = config.data

  return [200, { id, newQuery }]
})

export default axiosMock
