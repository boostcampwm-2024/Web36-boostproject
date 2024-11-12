import axios from 'axios'

const { BASE_URL } = process.env

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosClient
