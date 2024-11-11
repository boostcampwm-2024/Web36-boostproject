import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import shellDataRaw from '@/api/__mocks__/mocdata.json'

const shellData: ShellType[] = shellDataRaw.result

const axiosInstance = axios.create()
const mock = new MockAdapter(axiosInstance)

// fetch
mock.onGet('/shells').reply(200, shellData)

// add
mock.onPost('/shells').reply((config) => {
  const newShell: ShellType = JSON.parse(config.data)
  shellData.push(newShell)
  return [200, newShell.shellId]
})

// delete
// mock.onDelete(/\/shells\/\d+/).reply((config) => {})

// mock.onPut(/\/shells\/\d+/).reply((config) => {})

export default axiosInstance
