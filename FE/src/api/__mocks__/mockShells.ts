import * as MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import getMocResult from './util'
import shellDataRaw from './mocData.json'

const shellData: ShellType[] = shellDataRaw.result

export default function mockShells(mock: MockAdapter) {
  // fetch
  mock.onGet('/shells').reply(200, { data: shellData })

  // add
  mock.onPost('/shells').reply(() => {
    const newShell: ShellType = {
      id: Date.now(), // 임시키
      queryStatus: null,
      query: null,
      queryType: null,
      text: null,
      resultTable: null,
    }
    shellData.push(newShell)
    return [200, { data: { id: newShell.id } }]
  })

  // execute
  mock.onPost(/^\/shells(\/\d+\/execute)?$/).reply((config) => {
    const id = parseInt(config.url!.split('/')[2], 10)
    const executeddShell = shellData.find((shell) => shell.id === id)
    const index = shellData.findIndex((shell) => shell.id === id)

    if (!executeddShell) return [404, { error: 'Shell not found' }]
    const result = getMocResult(executeddShell)

    shellData.splice(index, 1, { ...executeddShell, ...result })

    if (Math.random() < 0.2) {
      return [429, { error: { message: 'connection too many Error.' } }]
    }

    if (Math.random() < 0.2) {
      return [430, { error: { message: 'usage limit exceed error.' } }]
    }

    return [200, { data: result }]
  })

  // delete
  mock.onDelete(/\/shells\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!, 10)
    const index = shellData.findIndex((shell) => shell.id === id)

    if (index === -1) return [404, { error: 'Shell not found' }]

    shellData.splice(index, 1)
    return [200, { data: id }]
  })

  // put
  mock.onPut(/\/shells\/\d+/).reply((config) => {
    const id = parseInt(config.url!.split('/').pop()!, 10)
    const newQuery = JSON.parse(config.data).query
    const changedShell = shellData.find((shell) => shell.id === id)

    if (!changedShell) return [404, { error: 'Shell not found' }]
    changedShell.query = newQuery
    return [200, { data: { id, newQuery } }]
  })
}
