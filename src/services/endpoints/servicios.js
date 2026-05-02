import apiClient from '../config/apiClient'

const ENDPOINT = '/servicios'

// serviciosService expone las operaciones CRUD del módulo servicios.
export const serviciosService = {
  getAll:  ()             => apiClient.get(ENDPOINT),
  getById: (id)           => apiClient.get(`${ENDPOINT}/${id}`),
  create:  (servicio)     => apiClient.post(ENDPOINT, servicio),
  update:  (id, cambios)  => apiClient.put(`${ENDPOINT}/${id}`, cambios),
  delete:  (id)           => apiClient.delete(`${ENDPOINT}/${id}`),
}
