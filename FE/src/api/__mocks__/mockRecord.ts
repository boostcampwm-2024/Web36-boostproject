import * as MockAdapter from 'axios-mock-adapter'
import { RecordResultType } from '@/types/interfaces'

const recordResult: RecordResultType = {
  status: true,
  text: 'randomDataTestTable 에 랜덤 레코드 10개 삽입되었습니다.',
}

export default function mockRecord(mock: MockAdapter) {
  mock.onPost('/record').reply(200, { data: recordResult })
}
