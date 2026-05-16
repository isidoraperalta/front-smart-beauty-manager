import { themeQuartz } from 'ag-grid-community'

// ── Tema personalizado con paleta teal ───────────────────────────────────────
export const sbmTheme = themeQuartz.withParams({
  accentColor: '#239089',
  selectedRowBackgroundColor: 'rgba(35, 144, 137, 0.08)',
  rowHoverColor: 'rgba(35, 144, 137, 0.04)',
  rangeSelectionBorderColor: '#4bb0a9',
  checkboxCheckedBackgroundColor: '#239089',
  checkboxCheckedBorderColor: '#239089',
})

export const LOCALE_SPANISH = {
  page: 'Página',
  more: 'Más',
  to: 'a',
  of: 'de',
  pageLastRowUnknown: 'última',
  notPinned: 'Sin anclar',
  pinned: 'Anclado',
  noData: 'Sin datos para mostrar',
  enabled: 'Habilitado',
  disabled: 'Deshabilitado',
  sortAscending: 'Ordenar de menor a mayor',
  sortDescending: 'Ordenar de mayor a menor',
  sortBy: 'Ordenar por',
  apply: 'Aplicar',
  clear: 'Limpiar',
  reset: 'Restablecer',
  search: 'Buscar',
  blanks: 'En blanco',
  filterOoo: 'Filtrar...',
  contains: 'Contiene',
  startsWith: 'Comienza con',
  endsWith: 'Termina con',
  selectAll: 'Seleccionar todo',
  nothingSelected: 'Nada seleccionado',
}

export const DEFAULT_COL_DEF = {
  sortable: true,
  filter: true,
  resizable: true,
}
