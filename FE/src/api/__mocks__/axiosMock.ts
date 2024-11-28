import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockShells from '@/api/__mocks__/mockShells'
import mockTables from '@/api/__mocks__/mockTables'
import mockRecord from '@/api/__mocks__/mockRecord'
import mockUsage from '@/api/__mocks__/mockUsages'

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

mockShells(mock)
mockTables(mock)
mockRecord(mock)
mockUsage(mock) // usage 관련 API 모킹

export default axiosMock
