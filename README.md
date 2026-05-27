# 🌸 Front Smart Beauty Manager

## 📋 Requisitos por opción de ejecución

| Herramienta | Opción 1<br>(Local) | Opción 2<br>(Docker) |
|---|---------|----------|
| 📦 Node.js 20+ | ✅ | ❌ |
| 🐳 Docker | ❌ | ✅ |

**Links de descargas:** [Node.js](https://nodejs.org) • [Docker](https://www.docker.com/products/docker-desktop)

---

## 🚀 Cómo ejecutar

### 💻 Opción 1: Local (Frontend en local)

Necesitas Node.js 20+ instalado localmente. El backend debe estar corriendo en `localhost:8080`.

**1️⃣ Instalar dependencias:**
```bash
npm install
```

**2️⃣ Crear archivo de entorno:**
```bash
# El archivo .env debe contener:
VITE_API_BACK_SBM_BASE_URL=http://localhost:8080
```

**3️⃣ Ejecutar el frontend:**
```bash
npm run dev
```

✅ Front: `http://localhost:5173`

---

### 🐳 Opción 2: Docker (Frontend y Backend en Docker)

Solo necesitas Docker instalado localmente.

**🚀 Ejecutar:**
```bash
docker compose up -d
```

✅ Front: `http://localhost:5173`

**📝 Después de cambiar código (forzar recompilación):**
```bash
docker compose up -d --build
```

**🛠️ Gestión:**
```bash
docker compose logs -f frontend    # 📊 Ver logs
docker compose down                # ⛔ Parar
```

---

## 📂 Estructura de carpetas

```
front-smart-beauty-manager/
├── src/
│   ├── main.jsx                                                # Punto de entrada — registra AG Grid y monta la app
│   ├── App.jsx                                                 # Enrutamiento (React Router)
│   ├── components/
│   │   ├── ConfirmarEliminacionModal.jsx                       # Diálogo de confirmación reutilizable
│   │   ├── Footer.jsx                                          # Pie de página
│   │   ├── Layout.jsx                                          # Esqueleto visual compartido: Navbar + Footer
│   │   ├── Navbar.jsx                                          # Barra de navegación superior con links a cada módulo
│   │   ├── ProtectedRoute.jsx                                  # Ruta protegida: redirige a /login si no hay sesión
│   │   └── PublicOnlyRoute.jsx                                 # Ruta pública: redirige a /home si ya hay sesión
│   ├── context/
│   │   └── DateFilterContext.jsx                               # Contexto global del filtro de fechas (persiste en localStorage)
│   ├── hooks/
│   │   └── useClickOutside.js                                  # Hook genérico para detectar clics fuera de un elemento
│   ├── pages/
│   │   ├── Login.jsx                                           # Formulario de autenticación
│   │   ├── Home.jsx                                            # Dashboard principal
│   │   ├── citas/
│   │   │   ├── Citas.jsx                                       # Orquestador del módulo de citas
│   │   │   ├── CalendarioCitas.jsx                             # Vista de calendario de citas
│   │   │   ├── ListaCitas.jsx                                  # Vista de lista de citas
│   │   │   ├── ListaCitasToolbar.jsx                           # Toolbar de la lista de citas
│   │   │   ├── hooks/
│   │   │   │   └── useCitas.js                                 # Custom hook con estado y lógica del módulo
│   │   │   └── modal/
│   │   │       └── AgregarCitaModal.jsx                        # Formulario para crear una cita
│   │   ├── clientes/
│   │   │   ├── Clientes.jsx                                    # Orquestador: ensambla hook + grid + modales
│   │   │   ├── hooks/
│   │   │   │   └── useClientes.js                              # Custom hook con todo el estado y la lógica del módulo
│   │   │   ├── grid/
│   │   │   │   ├── ClientesGrid.jsx                            # Tabla AG Grid + coordinación de toolbar y context
│   │   │   │   ├── ClientesGridToolbar.jsx                     # Barra: buscador, selector de columnas, exportar CSV
│   │   │   │   ├── agGridConfig.js                             # Locale español (40+ traducciones) + defaultColDef
│   │   │   │   └── useClientesColumnDefs.js                    # Hook que calcula columnas según visibilidad
│   │   │   └── modal/
│   │   │       └── AgregarClienteModal.jsx                     # Formulario Bootstrap para crear un cliente
│   │   ├── estadisticas/
│   │   │   ├── Estadisticas.jsx                                # Orquestador: tabs + filtro global de fechas
│   │   │   ├── TabGanancias.jsx                                # Gráfico y métricas de ganancias
│   │   │   ├── TabClientas.jsx                                 # Gráfico y métricas de clientas
│   │   │   ├── TabServicios.jsx                                # Gráfico y métricas de servicios
│   │   │   ├── TabCitas.jsx                                    # Gráfico y métricas de citas
│   │   │   └── useEstadisticas.js                              # Hook + helpers de filtrado y agrupación
│   │   └── servicios/
│   │       ├── ServiciosGestion.jsx                            # Orquestador del módulo de servicios
│   │       ├── hooks/
│   │       │   └── useServiciosModule.js                       # Custom hook con estado y lógica de servicios
│   │       ├── grid/
│   │       │   ├── ServiciosGrid.jsx                           # Tabla AG Grid para servicios
│   │       │   ├── ServiciosGridToolbar.jsx                    # Toolbar: búsqueda, columnas, exportar
│   │       │   ├── agGridConfig.js                             # Configuración de locale y estilos
│   │       │   └── useServiciosColumnDefs.js                   # Hook que calcula columnas dinámicamente
│   │       ├── config/
│   │       │   └── serviciosConfig.js                          # Configuración del módulo (campos, validaciones)
│   │       └── modal/
│   │           └── ServiciosModal.jsx                          # Formulario para crear/editar servicios
│   ├── services/
│   │   ├── index.js                                            # Punto de importación único
│   │   ├── config/
│   │   │   └── apiClient.js                                    # Cliente HTTP centralizado: GET/POST/PUT/DELETE + manejo de errores
│   │   └── endpoints/
│   │       ├── acciones.js                                     # Endpoint de acciones
│   │       ├── auth.js                                         # Endpoint de autenticación
│   │       ├── categorias.js                                   # Endpoint de categorías
│   │       ├── citas.js                                        # CRUD del endpoint /citas
│   │       ├── clientes.js                                     # CRUD del endpoint /clientes
│   │       ├── servicios.js                                    # CRUD del endpoint /servicios
│   │       └── tipos.js                                        # Endpoint de tipos
│   ├── styles/
│   │   └── theme.css                                           # Variables CSS, estilos globales y clases utilitarias
│   └── utils/
│       ├── agGridConfig.js                                     # Configuración compartida de AG Grid
│       └── auth.js                                             # Helpers de autenticación (localStorage token)
├── assets/                                                     # Imágenes y recursos estáticos
├── .env.example                                                # Ejemplo de variables de entorno (URL del backend)
├── vite.config.js                                              # Configuración de Vite y alias @ → ./src
├── docker-compose.yml                                          # Orquestación: frontend servido con nginx
├── Dockerfile                                                  # Multi-stage: build con Node + servir con nginx
├── nginx.conf                                                  # Configuración de nginx (SPA routing)
└── package.json / package-lock.json                            # Dependencias npm 
```

---

## 📚 Librerías utilizadas

### Dependencias principales

| Librería | Versión | Propósito |
|----------|---------|----------|
| **React** | ^19.2.5 | Framework de UI |
| **React DOM** | ^19.2.5 | Renderizado en el DOM |
| **React Router DOM** | ^7.14.2 | Enrutamiento y navegación |
| **Bootstrap** | ^5.3.8 | Estilos CSS y componentes UI |
| **AG Grid Community** | ^35.2.1 | Tablas y grillas avanzadas |
| **AG Grid React** | ^35.2.1 | Binding de AG Grid para React |
| **Recharts** | ^2.12.7 | Gráficos y visualización de estadísticas |
| **React Toastify** | ^11.1.0 | Notificaciones toast |
| **Lucide React** | ^1.16.0 | Iconos |
| **PropTypes** | ^15.8.1 | Validación de tipos en props |

### Dependencias de desarrollo

| Herramienta | Versión | Propósito |
|-------------|---------|----------|
| **Vite** | ^8.0.10 | Bundler y servidor de desarrollo rápido |
| **@vitejs/plugin-react** | ^6.0.1 | Plugin de React para Vite |
| **ESLint** | ^10.2.1 | Linter para detectar errores y mantener código limpio |
| **eslint-plugin-react-hooks** | ^7.1.1 | Reglas de ESLint para hooks de React |
| **eslint-plugin-react-refresh** | ^0.5.2 | Soporte de Fast Refresh en ESLint |
