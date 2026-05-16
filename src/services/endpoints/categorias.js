import apiClient from '../config/apiClient'

const ENDPOINT = '/categorias'

export const categoriasService = {
  getAll: () => apiClient.get(ENDPOINT),
  getById: (id) => apiClient.get(`${ENDPOINT}/${id}`),
  create: (payload) => apiClient.post(ENDPOINT, payload),
  update: (id, payload) => apiClient.put(`${ENDPOINT}/${id}`, payload),
  delete: (id) => apiClient.delete(`${ENDPOINT}/${id}`),
}
