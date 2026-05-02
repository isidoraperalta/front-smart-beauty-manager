import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { themeQuartz } from 'ag-grid-community'
import ClientesGridToolbar from './ClientesGridToolbar'
import { LOCALE_SPANISH, DEFAULT_COL_DEF } from './agGridConfig'
import { useClientesColumnDefs } from './useClientesColumnDefs'

// ── AccionesCellRenderer ──────────────────────────────────────────────────────
// Componente que AG Grid renderiza en la columna "Acciones" de cada fila.
// Recibe "context" que ClientesGrid le pasa vía la prop context={...}.
// Usamos context en lugar de props directas porque AG Grid no los pasa igual.
function AccionesCellRenderer({ data, context }) {
  return (
    <button
      className="btn btn-sm btn-danger"
      onClick={() => context.onAbrirConfirmacion(data.id)}
    >
      Eliminar
    </button>
  )
}

// Columnas que se pueden mostrar/ocultar desde el toolbar.
// "Acciones" no está en esta lista porque siempre debe ser visible.
const COLUMNAS_TOGGLE = [
  { field: 'nombre',   label: 'Nombre' },
  { field: 'email',    label: 'Email' },
  { field: 'telefono', label: 'Teléfono' },
]

// ── ClientesGrid ──────────────────────────────────────────────────────────────
// Componente que ensambla: toolbar + tabla AG Grid.
// Recibe los datos y callbacks del hook (vía Clientes.jsx); no hace llamadas al backend.
//
// Props:
//   clientes           → array de clientes a mostrar
//   onAbrirConfirmacion → abre el modal de confirmación con el ID recibido
//   onEditarInline      → guarda los cambios de una celda editada
export default function ClientesGrid({ clientes, onAbrirConfirmacion, onEditarInline, onExportSuccess }) {
  const gridRef   = useRef()   // acceso a la API interna de AG Grid (export, etc.)
  const pickerRef = useRef()   // referencia al dropdown de columnas (para cerrar al clic fuera)

  const [quickFilter, setQuickFilter]           = useState('')
  const [showColumnPicker, setShowColumnPicker] = useState(false)

  // Rastrea qué columnas están marcadas como visibles
  const [colsVisible, setColsVisible] = useState({
    nombre:   true,
    email:    true,
    telefono: true,
  })

  // Cierra el dropdown de columnas al hacer clic en cualquier parte fuera de él
  useEffect(() => {
    const cerrarSiClickFuera = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowColumnPicker(false)
      }
    }
    document.addEventListener('mousedown', cerrarSiClickFuera)
    return () => document.removeEventListener('mousedown', cerrarSiClickFuera)
  }, [])

  // Calcula el array de columnas según visibilidad actual (hook separado para claridad)
  const { colDefs } = useClientesColumnDefs(colsVisible, AccionesCellRenderer)

  // useMemo: solo recalcula si cambian las dependencias (en este caso, nunca)
  const defaultColDef = useMemo(() => DEFAULT_COL_DEF, [])

  // Se ejecuta cuando el usuario termina de editar una celda en el grid.
  // useCallback evita recrear la función en cada render (optimización de rendimiento).
  const onCellValueChanged = useCallback((params) => {
    const { id, nombre, email, telefono } = params.data
    onEditarInline(id, { nombre, email, telefono })
  }, [onEditarInline])

  // Muestra/oculta una columna al marcar/desmarcar su checkbox
  const toggleColumn = (field) => {
    setColsVisible(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // Exporta a CSV usando la API nativa de AG Grid.
  // Solo exporta las filas visibles (con los filtros aplicados).
  const handleExportCsv = () => {
    const fecha = new Date().toISOString().slice(0, 10)
    gridRef.current?.api?.exportDataAsCsv({ fileName: `clientes_${fecha}.csv` })
    onExportSuccess?.()
  }

  // "context" es el objeto que AG Grid inyecta en todos los cell renderers.
  // Lo usamos para pasarle onAbrirConfirmacion a AccionesCellRenderer.
  // useMemo evita que se recree el objeto en cada render.
  const context = useMemo(() => ({ onAbrirConfirmacion }), [onAbrirConfirmacion])

  // getRowId identifica cada fila de forma única.
  // AG Grid lo necesita para actualizar/eliminar filas correctamente sin recargar todo.
  const getRowId = useCallback((params) => String(params.data.id), [])

  return (
    <div>
      <ClientesGridToolbar
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        colsVisible={colsVisible}
        onToggleColumn={toggleColumn}
        onExportCsv={handleExportCsv}
        COLUMNAS_TOGGLE={COLUMNAS_TOGGLE}
        showColumnPicker={showColumnPicker}
        onToggleColumnPicker={() => setShowColumnPicker(prev => !prev)}
        pickerRef={pickerRef}
      />

      <div style={{ height: 520, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={clientes}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          theme={themeQuartz}
          localeText={LOCALE_SPANISH}
          quickFilterText={quickFilter}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={onCellValueChanged}
          context={context}
        />
      </div>
    </div>
  )
}
