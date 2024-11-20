import * as MockAdapter from 'axios-mock-adapter'
import { TableType } from '@/types/interfaces'
import mocDataTable from './mocDataTable.json'

const tableData: TableType[] = mocDataTable.tables

export default function mockTables(mock: MockAdapter) {
  // fetch
  mock.onGet('/tables').reply(200, { data: tableData })

  mock.onGet(/\/tables\/.+/).reply((config) => {
    const name = config.url!.split('/').pop()!
    const foundTable = tableData.find((table) => table.tableName === name)

    if (!foundTable) return [404, { error: 'Table not found' }]

    return [200, { data: foundTable }]
  })
}
