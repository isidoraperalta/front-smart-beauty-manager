import { useEffect } from 'react'

// useClickOutside — cierra un elemento flotante cuando el usuario
// hace clic fuera de él.
//
// Uso:
//   const ref = useRef()
//   useClickOutside(ref, () => setOpen(false))
//
// @param {React.RefObject} ref     referencia al elemento contenedor
// @param {Function}        handler callback que se ejecuta al clic externo
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}
