import Navbar from './Navbar'

// Layout es el esqueleto visual compartido por todas las páginas.
// Envuelve el contenido con la barra de navegación y lo centra con Bootstrap.
export default function Layout({ children }) {
  const year = new Date().getFullYear()

  return (
    <div className="sbm-layout">
      <Navbar />
      <main className="container sbm-main py-4 py-md-5">{children}</main>
      <footer className="sbm-footer py-3 mt-3">
        <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 small">
          <div>
            <p className="mb-1 fw-bold">Moon Studio</p>
            <p className="mb-0">moonstudio@mail.cl | +56 9 5555 5555</p>
          </div>

          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
            <a className="sbm-footer-link" href="https://instagram.com/moonstudio_cl" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a className="sbm-footer-link" href="https://www.facebook.com/moonstudio_cl" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a className="sbm-footer-link" href="https://wa.me/56955555555" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <span>© {year} Moon Studio</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
