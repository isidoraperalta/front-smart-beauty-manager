// useClientesColumnDefs
//
// Hook que calcula las definiciones de columna para AG Grid en función de
// qué columnas están visibles (colsVisible) y qué renderer usar para acciones.
//
// Al ser un hook separado, ClientesGrid queda limpio de esta lógica declarativa.
//
// Parámetros:
//   colsVisible          → { nombre: bool, email: bool, telefono: bool }
//   AccionesCellRenderer → componente React que renderiza el botón "Eliminar"

export function useClientesColumnDefs(colsVisible, AccionesCellRenderer) {
  // Cada columna se incluye solo si su flag en colsVisible es true.
  // El spread condicional [...(bool ? [objeto] : [])] es el patrón habitual
  // en React para incluir/excluir elementos de un array de forma declarativa.
  const colDefs = [
    ...(colsVisible.nombre ? [{
      field: 'nombre',
      headerName: 'Nombre',
      editable: true,
      flex: 1,
      minWidth: 150,
    }] : []),

    ...(colsVisible.email ? [{
      field: 'email',
      headerName: 'Email',
      editable: true,
      flex: 1,
      minWidth: 200,
    }] : []),

    ...(colsVisible.telefono ? [{
      field: 'telefono',
      headerName: 'Teléfono',
      editable: true,
      flex: 1,
      minWidth: 130,
    }] : []),

    // La columna de acciones siempre está visible y fija a la derecha
    {
      headerName: 'Acciones',
      cellRenderer: AccionesCellRenderer,
      editable: false,
      sortable: false,
      filter: false,
      width: 120,
      pinned: 'right',
    },
  ]

  return { colDefs }
}
