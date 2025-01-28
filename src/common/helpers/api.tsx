import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { globalStore } from '../config/globalStore'
import toast from './toast'

interface ApiParams {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: object
  params?: object
  headers?: object
  useAuthToken?: boolean
}

const api = async ({
  endpoint,
  method = 'GET',
  data = {},
  params = {},
  headers = {},
  useAuthToken = false,
}: ApiParams): Promise<AxiosResponse<any> | false> => {
  if (globalStore === null) {
    throw new Error('Global store is not initialized')
  }

  try {
    const { token } = globalStore.getState()

    const apiUrl = import.meta.env.VITE_API_URL

    if (!apiUrl) {
      throw new Error('API URL is not defined')
    }

    if (useAuthToken) {
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }

    const config: AxiosRequestConfig = {
      method,
      url: `${apiUrl}${endpoint}`,
      data,
      params,
      headers,
    }

    const response = await axios(config)
    return response
  } catch (error: any) {
    if (error.response.data.message) {
      toast.show.error(error.response.data.message)
    }

    console.error('API request failed:', error)

    return false
  }
}

export default api
