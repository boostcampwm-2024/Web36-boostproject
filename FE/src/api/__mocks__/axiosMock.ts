import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockShells from '@/api/__mocks__/mocShells'

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

mockShells(mock) // shells 관련 API 모킹

export default axiosMock
