// Punto de entrada único para todos los servicios.
// Los hooks importan desde aquí: import { clientesService } from '@/services'
export { clientesService }  from './endpoints/clientes'
export { citasService }     from './endpoints/citas'
export { serviciosService } from './endpoints/servicios'
export { categoriasService } from './endpoints/categorias'
export { tiposService } from './endpoints/tipos'
export { accionesService } from './endpoints/acciones'
export { authService } from './endpoints/auth'
