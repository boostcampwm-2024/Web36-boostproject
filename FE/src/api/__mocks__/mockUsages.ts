import * as MockAdapter from 'axios-mock-adapter'
import { UsageType } from '@/types/interfaces'
import mocDataUsage from './mocDataUsage.json'

const usageData: UsageType = mocDataUsage

export default function mockTables(mock: MockAdapter) {
  // fetch
  mock.onGet('/usage').reply(200, { data: usageData })

  mock.onGet(/\/tables\/.+/).reply((config) => {
    const name = config.url!.split('/').pop()!
    const foundTable = tableData.find((table) => table.tableName === name)

    if (!foundTable) return [404, { error: 'Table not found' }]

    return [200, { data: foundTable }]
  })
}
