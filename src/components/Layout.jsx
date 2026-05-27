import Navbar from './Navbar'
import Footer from './Footer'

// Layout es el esqueleto visual compartido por todas las páginas.
// Envuelve el contenido con la barra de navegación y lo centra con Bootstrap.
export default function Layout({ children }) {
  return (
    <div className="sbm-layout">
      <Navbar />
      <main className="container sbm-main py-4 py-md-5">{children}</main>
      <Footer />
    </div>
  )
}
