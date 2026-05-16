import Layout from "@/components/Layout";
import sbmLogoClean from "../../assets/smart-beauty-manager-logo-clean.jpeg";

export default function Home() {
  return (
    <Layout>
      <section className="sbm-module-page pb-3 pb-md-4 d-flex flex-column gap-4">
        <div className="sbm-home-hero p-4 p-md-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-6">
              <h1 className="display-6 fw-bold mb-2">Home</h1>
              Bienvenida a Smart Beauty Manager.
              <p className="mb-0 text-muted">
                Tu espacio, tu agenda, tu mejor version.
              </p>
              <p className="mb-0 text-muted">
                Organiza tus citas, gestiona tus clientes y haz crecer tu
                negocio.
              </p>
            </div>
            <div className="col-lg-6 d-flex flex-column gap-2 align-items-lg-end">
              <img
                src={sbmLogoClean}
                alt="Logo Smart Beauty Manager"
                className="img-fluid rounded-4 sbm-home-image"
              />
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="sbm-home-kpi p-4 h-100">
              <p className="text-muted mb-1">Agenda de hoy</p>
              <h2 className="h5 mb-0">8 citas programadas</h2>
              <p className="small text-muted mt-2 mb-0">
                Primera cita: 09:30 | Ultima cita: 19:00
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sbm-home-kpi p-4 h-100">
              <p className="text-muted mb-1">Recordatorios</p>
              <h2 className="h5 mb-0">3 seguimientos pendientes</h2>
              <p className="small text-muted mt-2 mb-0">
                Incluye retoques y confirmaciones de asistencia.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="sbm-home-kpi p-4 h-100">
              <p className="text-muted mb-1">Objetivo semanal</p>
              <h2 className="h5 mb-0">74% de meta completada</h2>
              <p className="small text-muted mt-2 mb-0">
                Mantener promociones activas para horas valle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
