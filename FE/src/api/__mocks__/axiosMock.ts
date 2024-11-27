import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockShells from '@/api/__mocks__/mockShells'
import mockTables from '@/api/__mocks__/mockTables'
import mockUsage from '@/api/__mocks__/mockUsages'

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

mockShells(mock) // shells 관련 API 모킹
mockTables(mock) // tables 관련 API 모킹
mockUsage(mock) // usage 관련 API 모킹

export default axiosMock
