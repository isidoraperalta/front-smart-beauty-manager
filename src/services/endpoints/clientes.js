import apiClient from '../config/apiClient'

const ENDPOINT = '/clientes'

// clientesService expone las operaciones CRUD del módulo clientes.
// Cada método delega en apiClient, que maneja headers y errores.
export const clientesService = {
  getAll:          ()           => apiClient.get(ENDPOINT),
  getById:         (id)         => apiClient.get(`${ENDPOINT}/${id}`),
  create:          (cliente)    => apiClient.post(ENDPOINT, cliente),
  update:          (id, cambios)=> apiClient.put(`${ENDPOINT}/${id}`, cambios),
  delete:          (id)         => apiClient.delete(`${ENDPOINT}/${id}`),
}
