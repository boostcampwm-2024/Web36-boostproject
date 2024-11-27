import * as MockAdapter from 'axios-mock-adapter'

export default function mockRecord(mock: MockAdapter) {
  mock.onPost('/record').reply(200, { data: 'success' })
}
