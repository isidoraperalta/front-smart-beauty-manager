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
│   │   ├── Layout.jsx                                          # Esqueleto visual compartido: Navbar
│   │   └── Navbar.jsx                                          # Barra de navegación superior con links a cada módulo
│   ├── pages/
│   │   ├── Landing.jsx                                         # Página de entrada
│   │   ├── Home.jsx                                            # Dashboard principal
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
│   │   │       ├── AgregarClienteModal.jsx                     # Formulario Bootstrap para crear un cliente
│   │   │       └── ConfirmarEliminacionModal.jsx               # Diálogo de confirmación antes de borrar
│   │   ├── citas/
│   │   │   └── Citas.jsx                                       # Módulo de citas (en desarrollo)
│   │   ├── servicios/
│   │   │   ├── ServiciosGestion.jsx                            # Orquestador del módulo de servicios
│   │   │   ├── hooks/
│   │   │   │   └── useServiciosModule.js                       # Custom hook con estado y lógica de servicios
│   │   │   ├── grid/
│   │   │   │   ├── ServiciosGrid.jsx                           # Tabla AG Grid para servicios
│   │   │   │   ├── ServiciosGridToolbar.jsx                    # Toolbar: búsqueda, columnas, exportar
│   │   │   │   ├── agGridConfig.js                             # Configuración de locale y estilos
│   │   │   │   └── useServiciosColumnDefs.js                   # Hook que calcula columnas dinámicamente
│   │   │   ├── config/
│   │   │   │   └── serviciosConfig.js                          # Configuración del módulo (campos, validaciones)
│   │   │   └── modal/
│   │   │       ├── ServiciosModal.jsx                          # Formulario para crear/editar servicios
│   │   │       └── ConfirmarEliminacionServiciosModal.jsx      # Diálogo de confirmación
│   │   └── informaciones/
│   │       └── Informaciones.jsx                               # Módulo de estadísticas y gráficos (en desarrollo)
│   └── services/
│       ├── index.js                                            # Punto de importación único
│       ├── config/
│       │   └── apiClient.js                                    # Cliente HTTP centralizado: GET/POST/PUT/DELETE + manejo de errores
│       └── endpoints/
│           ├── acciones.js                                     # Endpoint de acciones
│           ├── auth.js                                         # Endpoint de autenticación
│           ├── categorias.js                                   # Endpoint de categorías
│           ├── citas.js                                        # CRUD del endpoint /citas
│           ├── clientes.js                                     # CRUD del endpoint /clientes
│           ├── servicios.js                                    # CRUD del endpoint /servicios
│           └── tipos.js                                        # Endpoint de tipos
├── .env                                                        # Variables de entorno (URL del backend)
├── vite.config.js                                              # Configuración de Vite y alias @ → ./src
├── docker-compose.yml                                          # Orquestación: frontend servido con nginx
├── Dockerfile                                                  # Multi-stage: build con Node + servir con nginx
├── nginx.conf                                                  # Configuración de nginx (SPA routing)
└── package.json / package-lock.json                            # Dependencias npm 
```

---

## 🔗 Conexión con backend

🌐 Toda la comunicación HTTP pasa por `src/services/config/apiClient.js`, que actúa como cliente centralizado.  
📡 Los archivos en `src/services/endpoints/` son envoltorios delgados que llaman a `apiClient` con la ruta correcta:

```
useClientes.js          →  clientesService.getAll() →  apiClient.get('/clientes') →  fetch('http://localhost:8080/clientes')
```

⚠️ Cuando el backend devuelve un error, `apiClient` extrae el mensaje del cuerpo JSON y lo lanza como `Error`, para que el hook lo capture en un bloque `catch` y lo muestre en la UI.

---

## 📦 Capa de servicios (`src/services/`)

```
services/
├── index.js          ← re-exporta clientesService, citasService, serviciosService
├── config/
│   └── apiClient.js  ← cliente HTTP base
└── endpoints/
    ├── clientes.js   ← { getAll, getById, create, update, delete }
    ├── citas.js      ← { getAll, getById, create, update, delete }
    └── servicios.js  ← { getAll, getById, create, update, delete }
```

**`apiClient.js`** define cuatro métodos (`get`, `post`, `put`, `delete`) que comparten la misma lógica:
- Leen la URL base de `import.meta.env.VITE_API_BACK_SBM_BASE_URL`
- Ante cualquier respuesta no-OK, extraen el mensaje de error del JSON y lanzan una excepción

**Archivos de endpoint** (ej. `clientes.js`) son objetos con métodos de una línea que delegan en `apiClient`.  
Los hooks importan el servicio que necesitan desde `services/index.js`.

---

## 📚 Librerías utilizadas

### Dependencias principales

| Librería | Versión | Propósito |
|----------|---------|----------|
| **React** | ^19.2.5 | Framework de UI |
| **React Router DOM** | ^7.14.2 | Enrutamiento y navegación |
| **Bootstrap** | ^5.3.8 | Estilos CSS y componentes UI |
| **AG Grid Community** | ^35.2.1 | Tablas y grillas avanzadas |
| **AG Grid React** | ^35.2.1 | Binding de AG Grid para React |
| **PropTypes** | ^15.8.1 | Validación de tipos en props |

### Dependencias de desarrollo

| Herramienta | Propósito |
|-------------|----------|
| **Vite** | Bundler y servidor de desarrollo rápido |
| **ESLint** | Linter para detectar errores y mantener código limpio |
| **@vitejs/plugin-react** | Plugin de React para Vite |

### 🔄 Pendientes de implementar

| Librería | Propósito | Estado |
|----------|----------|--------|
| **Calendario** | Mostrar citas de la semana en el módulo Home | Por evaluar |
| **Gráficos** | Mostrar estadísticas y análisis en el módulo Informaciones | Por evaluar |

**Instalación automática:** `npm install`
