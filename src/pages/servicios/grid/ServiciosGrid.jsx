import { useMemo, useRef, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { sbmTheme, LOCALE_SPANISH, DEFAULT_COL_DEF } from './agGridConfig'
import PropTypes from 'prop-types'
import ServiciosGridToolbar from './ServiciosGridToolbar'
import { useServiciosColumnDefs } from './useServiciosColumnDefs'
import { SERVICIOS_TOGGLE_COLUMNS, SERVICIOS_DEFAULT_VISIBLE_COLUMNS } from '../config/serviciosConfig'
import { useClickOutside } from '@/hooks/useClickOutside'

function AccionesCellRenderer({ data, context }) {
  return (
    <div className="d-flex gap-2">
      <button type="button" className="btn btn-sm sbm-btn-delete" onClick={() => context.onDelete(data)}>
        Eliminar
      </button>
    </div>
  )
}

AccionesCellRenderer.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  context: PropTypes.shape({
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
}

export default function ServiciosGrid({
  entityKey,
  rowData,
  servicesLookups,
  onInlineUpdate,
  onDelete,
  onAdd,
  addLabel,
}) {
  const gridRef = useRef()
  const pickerRef = useRef()
  const [quickFilter, setQuickFilter] = useState('')
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [colsVisible, setColsVisible] = useState(SERVICIOS_DEFAULT_VISIBLE_COLUMNS[entityKey] || {})

  useClickOutside(pickerRef, () => setShowColumnPicker(false))

  const { colDefs } = useServiciosColumnDefs(entityKey, colsVisible, servicesLookups, AccionesCellRenderer)
  const defaultColDef = useMemo(() => DEFAULT_COL_DEF, [])
  const context = useMemo(() => ({ onDelete }), [onDelete])

  const toggleColumn = useCallback((field) => {
    setColsVisible((prev) => ({ ...prev, [field]: !prev[field] }))
  }, [])

  const canToggleColumns = (SERVICIOS_TOGGLE_COLUMNS[entityKey] || []).length > 0

  const handleCellValueChanged = useCallback((params) => {
    if (!params.data || !onInlineUpdate) return

    if (entityKey === 'servicios' && params.colDef.field === 'tipoId') {
      const selectedTipo = servicesLookups.tipos.find((tipo) => tipo.id === String(params.data.tipoId))
      params.data.categoriaId = selectedTipo?.categoriaId || ''
    }

    onInlineUpdate(params.data)
  }, [entityKey, servicesLookups.tipos, onInlineUpdate])

  return (
    <div className="sbm-grid-wrapper">
      <ServiciosGridToolbar
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        colsVisible={colsVisible}
        onToggleColumn={toggleColumn}
        columnToggles={SERVICIOS_TOGGLE_COLUMNS[entityKey] || []}
        showColumnPicker={showColumnPicker}
        onToggleColumnPicker={() => setShowColumnPicker((prev) => !prev)}
        pickerRef={pickerRef}
        canToggleColumns={canToggleColumns}
      />

      <div className="sbm-grid-frame">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          theme={sbmTheme}
          localeText={LOCALE_SPANISH}
          quickFilterText={quickFilter}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          domLayout="normal"
          overlayNoRowsTemplate="<span>No hay registros para mostrar</span>"
          context={context}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={handleCellValueChanged}
        />
      </div>
    </div>
  )
}

ServiciosGrid.propTypes = {
  entityKey: PropTypes.oneOf(['servicios', 'tipos', 'categorias', 'acciones']).isRequired,
  rowData: PropTypes.array.isRequired,
  servicesLookups: PropTypes.shape({
    categorias: PropTypes.array.isRequired,
    tipos: PropTypes.array.isRequired,
    acciones: PropTypes.array.isRequired,
    categoriaNameById: PropTypes.object.isRequired,
    tipoNameById: PropTypes.object.isRequired,
    accionNameById: PropTypes.object.isRequired,
  }).isRequired,
  onInlineUpdate: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
}
