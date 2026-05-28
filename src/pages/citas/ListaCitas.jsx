import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { sbmTheme, LOCALE_SPANISH } from '../clientes/grid/agGridConfig'
import ListaCitasToolbar from './ListaCitasToolbar'
import PropTypes from 'prop-types'

// Editor personalizado para fecha y hora
// Usa onValueChange (AG Grid v31+) para que el valor quede disponible en onCellValueChanged
const DateTimeCellEditor = ({ value, onValueChange, stopEditing }) => {
  const toLocal = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const [localVal, setLocalVal] = useState(toLocal(value))

  const handleChange = (e) => {
    const v = e.target.value
    setLocalVal(v)
    if (v) {
      // El datetime-local está en hora local. Crear fecha y restar el offset de zona horaria
      // para que cuando se convierta a ISO, se interprete correctamente en el backend
      const d = new Date(v)
      const offset = d.getTimezoneOffset() * 60000
      const isoString = new Date(d.getTime() - offset).toISOString()
      onValueChange(isoString)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: '#fff', border: '1px solid #06b6d4', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,.18)' }}>
      <input
        type="datetime-local"
        value={localVal}
        onChange={handleChange}
        autoFocus
        style={{ height: '26px', flex: 1, border: 'none', outline: 'none', fontSize: '0.85rem', minWidth: 190 }}
      />
      <button
        onClick={() => stopEditing()}
        style={{ height: '26px', padding: '0 9px', fontSize: '0.75rem', background: '#06b6d4', color: '#fff', border: 'none', borderRadius: 3, cursor: 'pointer', flexShrink: 0 }}
      >
        ✓
      </button>
    </div>
  )
}

const ESTADO_COLORS = {
  AGENDADA:   { bg: '#dbeafe', text: '#1e40af' },
  CONFIRMADA: { bg: '#fef08a', text: '#92400e' },
  REALIZADA:  { bg: '#dcfce7', text: '#166534' },
  CANCELADA:  { bg: '#fee2e2', text: '#991b1b' },
}

const ESTADOS = ['AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA']
const LUGARES = ['LOCAL', 'DOMICILIO']

const COLUMNAS_TOGGLE = [
  { field: 'estado', label: 'Estado' },
  { field: 'lugar', label: 'Lugar' },
  { field: 'descuento', label: 'Descuento' },
  { field: 'cargoExtra', label: 'Cargo extra' },
  { field: 'valorTotal', label: 'Total' },
  { field: 'diasParaRetocar', label: 'Días retoque' },
  { field: 'notas', label: 'Notas' },
]

function EstadoCellRenderer({ value }) {
  const col = ESTADO_COLORS[value] || {}
  return (
    <span className="badge rounded-pill px-2" style={{ background: col.bg, color: col.text, border: `1px solid ${col.text}33`, fontSize: '0.72rem' }}>
      {value}
    </span>
  )
}

function AccionesCellRenderer({ data, context }) {
  return (
    <div className="d-flex gap-1 align-items-center h-100">
      <button className="btn btn-sm sbm-btn-delete" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}
        onClick={() => context.onEliminar(data.id)}>
        Eliminar
      </button>
    </div>
  )
}

const DEFAULT_COL_DEF = {
  sortable: true,
  filter: true,
  resizable: true,
  suppressMovable: false,
  minWidth: 80,
}

export default function ListaCitas({ citas, clientes = [], servicios = [], acciones = [], onEliminar, onActualizar }) {
  const gridRef = useRef()
  const pickerRef = useRef()
  const pendingPageRef = useRef(null)
  
  const [quickFilter, setQuickFilter] = useState('')
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [colsVisible, setColsVisible] = useState({
    estado: true,
    lugar: true,
    descuento: true,
    cargoExtra: true,
    valorTotal: true,
    diasParaRetocar: true,
    notas: true,
  })

  // Cierra el dropdown de columnas al hacer clic fuera
  useEffect(() => {
    const cerrarSiClickFuera = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowColumnPicker(false)
      }
    }
    document.addEventListener('mousedown', cerrarSiClickFuera)
    return () => document.removeEventListener('mousedown', cerrarSiClickFuera)
  }, [])

  const citasOrdenadas = useMemo(
    () => [...citas].sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)),
    [citas]
  )

  const colDefs = useMemo(() => [
    {
      field: 'fechaHora',
      headerName: 'Fecha y hora',
      width: 175,
      editable: true,
      cellEditor: DateTimeCellEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: 'under',
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : '—',
      sort: 'desc',
    },
    {
      headerName: 'Cliente',
      field: 'clienteId',
      editable: true,
      valueGetter: ({ data }) => {
        const id = data?.cliente?.id ?? data?.clienteId
        return clientes.find(c => c.id === id)?.nombre ?? null
      },
      valueSetter: ({ data, newValue }) => {
        const c = clientes.find(c => c.nombre === newValue)
        data.clienteId = c?.id ?? data.cliente?.id
        return true
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: clientes.map(c => c.nombre) },
      valueFormatter: ({ value }) => value || '—',
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: 'Servicio',
      field: 'servicioId',
      editable: true,
      valueGetter: ({ data }) => {
        const id = data?.servicio?.id ?? data?.servicioId
        const s = servicios.find(s => s.id === id)
        if (!s) return null
        const accion = s.accion?.nombre
        const mostrarAccion = accion && accion.toLowerCase() !== 'no aplica'
        return mostrarAccion ? `${s.tipo?.nombre || '?'} — ${accion}` : (s.tipo?.nombre || '?')
      },
      valueSetter: ({ data, newValue }) => {
        const s = servicios.find(s => {
          const accion = s.accion?.nombre
          const mostrarAccion = accion && accion.toLowerCase() !== 'no aplica'
          const label = mostrarAccion ? `${s.tipo?.nombre || '?'} — ${accion}` : (s.tipo?.nombre || '?')
          return label === newValue
        })
        data.servicioId = s?.id ?? data.servicio?.id
        return true
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: servicios.map(s => {
          const accion = s.accion?.nombre
          const mostrarAccion = accion && accion.toLowerCase() !== 'no aplica'
          return mostrarAccion ? `${s.tipo?.nombre || '?'} — ${accion}` : (s.tipo?.nombre || '?')
        }),
      },
      valueFormatter: ({ value }) => value || '—',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 135,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ESTADOS },
      cellRenderer: EstadoCellRenderer,
      filter: 'agSetColumnFilter',
      hide: !colsVisible.estado,
    },
    {
      field: 'lugar',
      headerName: 'Lugar',
      width: 110,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: LUGARES },
      hide: !colsVisible.lugar,
    },
    {
      field: 'descuento',
      headerName: 'Descuento',
      width: 110,
      editable: true,
      type: 'numericColumn',
      cellEditor: 'agNumberCellEditor',
      valueFormatter: ({ value }) =>
        value != null && value !== 0 ? `$${Number(value).toLocaleString('es-CL')}` : '—',
      hide: !colsVisible.descuento,
    },
    {
      field: 'cargoExtra',
      headerName: 'Cargo extra',
      width: 115,
      editable: true,
      type: 'numericColumn',
      cellEditor: 'agNumberCellEditor',
      valueFormatter: ({ value }) =>
        value != null && value !== 0 ? `$${Number(value).toLocaleString('es-CL')}` : '—',
      hide: !colsVisible.cargoExtra,
    },
    {
      field: 'diasParaRetocar',
      headerName: 'Días retoque',
      editable: true,
      width: 110,
      type: 'numericColumn',
      cellEditor: 'agNumberCellEditor',
      hide: !colsVisible.diasParaRetocar,
    },
    {
      field: 'valorTotal',
      headerName: 'Total',
      width: 100,
      editable: false,
      type: 'numericColumn',
      valueFormatter: ({ value }) =>
        value != null ? `$${Number(value).toLocaleString('es-CL')}` : '—',
      hide: !colsVisible.valorTotal,
    },
    {
      field: 'notas',
      headerName: 'Notas',
      flex: 1,
      minWidth: 140,
      editable: true,
      cellEditor: 'agTextCellEditor',
      valueFormatter: ({ value }) => value || '—',
      hide: !colsVisible.notas,
    },
    {
      headerName: '',
      width: 90,
      cellRenderer: AccionesCellRenderer,
      sortable: false,
      filter: false,
      editable: false,
      pinned: 'right',
    },
  ], [colsVisible, clientes, servicios, acciones])

  const context = useMemo(() => ({ onEliminar }), [onEliminar])

  // onRowDataUpdated se dispara cuando AG Grid procesa el nuevo rowData.
  // El reset de paginación ocurre DESPUÉS, por eso usamos setTimeout(0).
  const onRowDataUpdated = useCallback(() => {
    if (pendingPageRef.current === null) return
    const pending = pendingPageRef.current
    pendingPageRef.current = null
    setTimeout(() => {
      if (!gridRef.current?.api) return
      const api = gridRef.current.api
      if (pending.pageSize !== api.paginationGetPageSize()) {
        api.updateGridOptions({ paginationPageSize: pending.pageSize })
      }
      api.paginationGoToPage(pending.page)
    }, 0)
  }, [])

  const onCellValueChanged = useCallback((params) => {
    if (gridRef.current?.api) {
      pendingPageRef.current = {
        page:     gridRef.current.api.paginationGetCurrentPage(),
        pageSize: gridRef.current.api.paginationGetPageSize(),
      }
    }

    const d = params.data
    onActualizar(d.id, {
      estado:           d.estado,
      lugar:            d.lugar,
      descuento:        d.descuento ?? 0,
      cargoExtra:       d.cargoExtra ?? null,
      diasParaRetocar:  d.diasParaRetocar ?? null,
      notas:            d.notas ?? null,
      servicioId:       d.servicioId || d.servicio?.id,
      clienteId:        d.clienteId || d.cliente?.id,
      fechaHora:        d.fechaHora,
    })
  }, [onActualizar])



  if (citas.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <span style={{ fontSize: '3rem' }}>📅</span>
        <p className="mt-3">No hay citas registradas.</p>
      </div>
    )
  }

  return (
    <div className="sbm-grid-wrapper">
      {/* Toolbar con buscador y selector de columnas */}
      <ListaCitasToolbar
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        colsVisible={colsVisible}
        onToggleColumn={(field) => setColsVisible(prev => ({ ...prev, [field]: !prev[field] }))}
        COLUMNAS_TOGGLE={COLUMNAS_TOGGLE}
        showColumnPicker={showColumnPicker}
        onToggleColumnPicker={() => setShowColumnPicker(!showColumnPicker)}
        pickerRef={pickerRef}
      />

      {/* Grid */}
      <div className="sbm-grid-frame">
        <AgGridReact
          ref={gridRef}
          theme={sbmTheme}
          rowData={citasOrdenadas}
          columnDefs={colDefs}
          defaultColDef={DEFAULT_COL_DEF}
          localeText={LOCALE_SPANISH}
          quickFilterText={quickFilter}
          context={context}
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 50]}
          rowHeight={40}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={onCellValueChanged}
          onRowDataUpdated={onRowDataUpdated}
        />
      </div>
    </div>
  )
}

ListaCitas.propTypes = {
  citas:       PropTypes.array.isRequired,
  clientes:    PropTypes.array,
  servicios:   PropTypes.array,
  acciones:    PropTypes.array,
  onEliminar:  PropTypes.func.isRequired,
  onActualizar: PropTypes.func.isRequired,
}


