import { Mail, Phone, Camera, MessageCircle } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="sbm-footer">
      <div className="container">
        <div className="row g-3 py-2 align-items-center">
          {/* Contacto */}
          <div className="col-12 col-md-4">
            <p className="mb-1"><strong>Moon Studio</strong></p>
            <div className="d-flex flex-column gap-1 small">
              <a href="mailto:moonstudio@mail.cl" className="sbm-footer-link d-flex align-items-center gap-2">
                <Mail size={16} />
                <span>moonstudio@mail.cl</span>
              </a>
              <a href="tel:+56955555555" className="sbm-footer-link d-flex align-items-center gap-2">
                <Phone size={16} />
                <span>+56 9 5555 5555</span>
              </a>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="col-12 col-md-4 text-center">
            <div className="d-flex justify-content-center gap-3">
              <a 
                href="https://instagram.com/moonstudio_cl" 
                target="_blank" 
                rel="noreferrer"
                className="sbm-footer-social"
                title="Instagram"
              >
                <Camera size={18} color="#E1306C" />
              </a>
              <a 
                href="https://www.facebook.com/moonstudio_cl" 
                target="_blank" 
                rel="noreferrer"
                className="sbm-footer-social"
                title="Facebook"
              >
                <span className="fw-bold" style={{ color: '#1877F2', fontSize: '16px' }}>f</span>
              </a>
              <a 
                href="https://wa.me/56955555555" 
                target="_blank" 
                rel="noreferrer"
                className="sbm-footer-social"
                title="WhatsApp"
              >
                <MessageCircle size={18} color="#25D366" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-12 col-md-4 text-md-end small">
            <p className="mb-1">© {year} Moon Studio</p>
            <p className="mb-0 text-muted">Hecho con ♥ para ti</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
