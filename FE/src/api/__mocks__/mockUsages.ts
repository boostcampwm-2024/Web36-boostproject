import * as MockAdapter from 'axios-mock-adapter'
import { UsageType } from '@/types/interfaces'

const usageData: UsageType = {
  currentUsage: 500,
  availUsage: 500000,
}

export default function mockUsages(mock: MockAdapter) {
  const delay = (ms: number) =>
    // eslint-disable-next-line no-promise-executor-return
    new Promise((resolve) => setTimeout(resolve, ms))

  // fetch
  mock.onGet('/usage').reply(async () => {
    await delay(1000)
    return [200, { data: usageData }]
  })
}
