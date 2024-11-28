import * as MockAdapter from 'axios-mock-adapter'
import { RecordResultType } from '@/types/interfaces'

const recordResult: RecordResultType = {
  status: true,
  text: '10 records successfully insterted into randomDataTestTable Table.',
}

export default function mockRecord(mock: MockAdapter) {
  mock.onPost('/record').reply((config) => {
    if (Math.random() < 0.2) {
      return [429, { error: { message: 'connection too many Error.' } }]
    }

    if (Math.random() < 0.2) {
      return [430, { error: { message: 'usage limit exceed error.' } }]
    }

    return [200, { data: recordResult }]
  })
}
