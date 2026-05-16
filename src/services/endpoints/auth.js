import apiClient from '../config/apiClient'

const ENDPOINT = '/auth'

export const authService = {
  login: (credentials) => apiClient.post(`${ENDPOINT}/login`, credentials),
}
