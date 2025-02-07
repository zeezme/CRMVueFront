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
  showErrorToast?: boolean
}

/**
 * Makes an HTTP request using Axios with the specified parameters.
 *
 * @param {string} endpoint - The API endpoint to send the request to.
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} [method='GET'] - The HTTP method to use.
 * @param {object} [data={}] - The data to send with the request, applicable for methods like POST or PUT.
 * @param {object} [params={}] - The URL parameters to include with the request.
 * @param {object} [headers={}] - Custom headers to include with the request.
 * @param {boolean} [useAuthToken=false] - Whether to include the Authorization token in the request headers.
 * @param {boolean} [showErrorToast=true] - Whether to show an error toast notification if the request fails.
 *
 * @returns {Promise<AxiosResponse<any>>} - Returns a promise that resolves to the Axios response.
 *
 * @throws Will throw an error if the global store is not initialized, the API URL is not defined,
 * or if the request fails. Errors with a message in the response data will be shown as a toast notification.
 */

const api = async ({
  endpoint,
  method = 'GET',
  data = {},
  params = {},
  headers = {},
  useAuthToken = false,
  showErrorToast = true,
}: ApiParams): Promise<AxiosResponse<any>> => {
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
        Authorization: `Bearer ${token.value}`,
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
    if (showErrorToast) {
      if (error?.response?.data?.message) {
        toast.show.error(error.response.data.message)
      } else {
        toast.show.error(error)
      }
    }

    console.error('API request failed:', error)

    throw error
  }
}

export default api
