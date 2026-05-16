export const SERVICIOS_TABS = [
  {
    key: 'servicios',
    label: 'Servicios',
    singular: 'Servicio',
    plural: 'Servicios',
    createLabel: 'Agregar Servicio',
  },
  {
    key: 'tipos',
    label: 'Tipos',
    singular: 'Tipo',
    plural: 'Tipos',
    createLabel: 'Agregar Tipo',
  },
  {
    key: 'categorias',
    label: 'Categorías',
    singular: 'Categoría',
    plural: 'Categorías',
    createLabel: 'Agregar Categoría',
  },
  {
    key: 'acciones',
    label: 'Acciones',
    singular: 'Acción',
    plural: 'Acciones',
    createLabel: 'Agregar Acción',
  },
]

export const SERVICIOS_INITIAL_DATA = {
  servicios: [],
  tipos: [],
  categorias: [],
  acciones: [],
}

export const SERVICIOS_INITIAL_FORM = {
  servicios: {
    tipoId: '',
    accionId: '',
    precio: '',
    duracionMinutos: '',
    diasParaRetocar: '',
  },
  tipos: {
    categoriaId: '',
    nombre: '',
    descripcion: '',
    activo: true,
  },
  categorias: {
    nombre: '',
  },
  acciones: {
    nombre: '',
  },
}

export const SERVICIOS_LABELS = {
  servicios: 'Servicio',
  tipos: 'Tipo',
  categorias: 'Categoría',
  acciones: 'Acción',
}

export const SERVICIOS_TOGGLE_COLUMNS = {
  servicios: [
    { field: 'tipoId', label: 'Tipo' },
    { field: 'categoriaId', label: 'Categoría' },
    { field: 'accionId', label: 'Acción' },
    { field: 'precio', label: 'Precio' },
    { field: 'duracionMinutos', label: 'Duración' },
    { field: 'diasParaRetocar', label: 'Retocar' },
  ],
  tipos: [
    { field: 'categoriaId', label: 'Categoría' },
    { field: 'descripcion', label: 'Descripción' },
    { field: 'activo', label: 'Estado' },
  ],
  categorias: [],
  acciones: [],
}

export const SERVICIOS_DEFAULT_VISIBLE_COLUMNS = {
  servicios: {
    tipoId: true,
    categoriaId: true,
    accionId: true,
    precio: true,
    duracionMinutos: true,
    diasParaRetocar: true,
  },
  tipos: {
    categoriaId: true,
    descripcion: true,
    activo: true,
  },
  categorias: {},
  acciones: {},
}

export const SERVICIOS_FORM_FIELDS = {
  servicios: [
    { name: 'tipoId', label: 'Tipo', type: 'select', required: true },
    { name: 'accionId', label: 'Acción', type: 'select', required: true },
    { name: 'precio', label: 'Precio', type: 'number', required: true, min: 0 },
    { name: 'duracionMinutos', label: 'Duración (min)', type: 'number', required: true, min: 1 },
    { name: 'diasParaRetocar', label: 'Días para retocar', type: 'number', required: false, min: 0 },
  ],
  tipos: [
    { name: 'categoriaId', label: 'Categoría', type: 'select', required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    { name: 'activo', label: 'Activo', type: 'switch', required: false },
  ],
  categorias: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  ],
  acciones: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  ],
}

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function buildServiciosPayload(entityKey, formData) {
  if (entityKey === 'categorias' || entityKey === 'acciones') {
    return { nombre: formData.nombre.trim() }
  }

  if (entityKey === 'tipos') {
    return {
      categoriaId: Number(formData.categoriaId),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion?.trim() || null,
      activo: Boolean(formData.activo),
    }
  }

  return {
    tipoId: Number(formData.tipoId),
    accionId: Number(formData.accionId),
    precio: Number(formData.precio),
    duracionMinutos: Number(formData.duracionMinutos),
    diasParaRetocar: toNumberOrNull(formData.diasParaRetocar),
  }
}

