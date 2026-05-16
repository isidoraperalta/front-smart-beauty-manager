const TEXT_FILTER_OPTIONS = ['contains', 'notContains', 'equals', 'notEqual', 'startsWith', 'endsWith']

const createTextFilter = () => ({
  filterOptions: TEXT_FILTER_OPTIONS,
  defaultOption: 'contains',
  maxNumConditions: 1,
})

const visibleColumn = (visibilityMap, field) => (
  !visibilityMap || visibilityMap[field] !== false
)

const textCol = ({ field, headerName, editable = true, minWidth = 160 }) => ({
  field,
  headerName,
  editable,
  flex: 1,
  minWidth,
  filter: 'agTextColumnFilter',
  filterParams: createTextFilter(),
})

const numberCol = ({ field, headerName, editable = true, minWidth = 120, valueFormatter }) => ({
  field,
  headerName,
  editable,
  flex: 1,
  minWidth,
  filter: 'agNumberColumnFilter',
  valueFormatter,
})

const selectCol = ({ field, headerName, editable = true, minWidth = 180, options, getLabel }) => ({
  field,
  headerName,
  editable,
  flex: 1,
  minWidth,
  cellEditor: 'agSelectCellEditor',
  cellEditorParams: { values: options.map((option) => option.id) },
  valueFormatter: (params) => getLabel(params.value),
  filter: 'agTextColumnFilter',
  filterParams: createTextFilter(),
  filterValueGetter: (params) => getLabel(params.data?.[field] ?? params.value),
})

const checkboxCol = ({ field, headerName, minWidth = 120 }) => ({
  field,
  headerName,
  editable: true,
  flex: 1,
  minWidth,
  cellEditor: 'agCheckboxCellEditor',
  filter: 'agTextColumnFilter',
  filterParams: createTextFilter(),
  filterValueGetter: (params) => (params.data?.[field] ? 'Activo' : 'Inactivo'),
  valueFormatter: (params) => (params.value ? 'Activo' : 'Inactivo'),
})

function buildColumnDefs(entityKey, visibilityMap, lookups) {
  if (entityKey === 'servicios') {
    return [
      selectCol({
        field: 'tipoId',
        headerName: 'Tipo',
        options: lookups.tipos,
        getLabel: (value) => lookups.tipoNameById[value] || '',
      }),
      selectCol({
        field: 'categoriaId',
        headerName: 'Categoría',
        editable: false,
        options: lookups.categorias,
        getLabel: (value) => lookups.categoriaNameById[value] || '',
      }),
      selectCol({
        field: 'accionId',
        headerName: 'Acción',
        options: lookups.acciones,
        getLabel: (value) => lookups.accionNameById[value] || '',
      }),
      numberCol({ field: 'precio', headerName: 'Precio' }),
      numberCol({ field: 'duracionMinutos', headerName: 'Duración' }),
      numberCol({
        field: 'diasParaRetocar',
        headerName: 'Retocar',
        valueFormatter: (params) => {
          if (params.value === null || params.value === undefined || params.value === '') return ''
          const parsed = Number(params.value)
          return Number.isNaN(parsed) ? '' : parsed
        },
      }),
    ].filter((column) => visibleColumn(visibilityMap, column.field))
  }

  if (entityKey === 'tipos') {
    return [
      selectCol({
        field: 'categoriaId',
        headerName: 'Categoría',
        options: lookups.categorias,
        getLabel: (value) => lookups.categoriaNameById[value] || '',
      }),
      textCol({ field: 'nombre', headerName: 'Nombre', minWidth: 180 }),
      textCol({ field: 'descripcion', headerName: 'Descripción', minWidth: 220 }),
      checkboxCol({ field: 'activo', headerName: 'Estado', minWidth: 120 }),
    ].filter((column) => visibleColumn(visibilityMap, column.field))
  }

  return [
    textCol({ field: 'nombre', headerName: 'Nombre', minWidth: 220 }),
  ].filter((column) => visibleColumn(visibilityMap, column.field))
}

export function useServiciosColumnDefs(entityKey, visibilityMap, lookups, AccionesCellRenderer) {
  const colDefs = [
    ...buildColumnDefs(entityKey, visibilityMap, lookups),
    {
      headerName: 'Acciones',
      cellRenderer: AccionesCellRenderer,
      editable: false,
      sortable: false,
      filter: false,
      width: 160,
      pinned: 'right',
    },
  ]

  return { colDefs }
}
