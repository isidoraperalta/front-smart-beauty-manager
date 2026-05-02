import Navbar from './Navbar'

// Layout es el esqueleto visual compartido por todas las páginas.
// Envuelve el contenido con la barra de navegación y lo centra con Bootstrap.
export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="container mt-5">{children}</main>
    </div>
  )
}
