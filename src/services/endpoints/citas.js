import apiClient from '../config/apiClient'

const ENDPOINT = '/citas'

// citasService expone las operaciones CRUD del módulo citas.
export const citasService = {
  getAll:  ()          => apiClient.get(ENDPOINT),
  getById: (id)        => apiClient.get(`${ENDPOINT}/${id}`),
  create:  (cita)      => apiClient.post(ENDPOINT, cita),
  update:  (id, cambios) => apiClient.put(`${ENDPOINT}/${id}`, cambios),
  delete:  (id)        => apiClient.delete(`${ENDPOINT}/${id}`),
}
