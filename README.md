# 💇 Front Smart Beauty Manager

## 📋 Prerrequisitos

| Herramienta | Versión mínima | Instalación |
|-------------|---------------|-------------|
| **📦 Node.js** | 20.19.0           | [nodejs.org](https://nodejs.org) - Si es que se levanta sin **docker** |
| **🐳 Docker**  | cualquiera    | [docker.com](https://www.docker.com/products/docker-desktop) - solo para la opción Docker |
| **⚙️ Backend** | -            | El backend debe estar corriendo en `localhost:8080` |

---

## 🚀 Opción A — Ejecución local (desarrollo)

```bash
# 1. 📥 Instalar dependencias
npm install

# 2. 🔧 Crear el archivo de entorno (si no existe)
#    Contenido: VITE_API_BACK_SBM_BASE_URL=http://localhost:8080
cp .env.example .env   # o créalo manualmente

# 3. ▶️ Iniciar el servidor de desarrollo
npm run dev
#    Abre http://localhost:5173
```

---

## 🐳 Opción B — Docker

```bash
# 🔨 Construye la imagen y levanta el contenedor
docker compose up -d
#    Abre http://localhost:5173
```

```bash
# ⛔ Detener contenedor
docker compose down
```

---
## 📁 Estructura de carpetas

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
│   │   └── clientes/
│   │       ├── Clientes.jsx                                    # Orquestador: ensambla hook + grid + modales
│   │       ├── hooks/
│   │       │   └── useClientes.js                              # Custom hook con todo el estado y la lógica del módulo
│   │       ├── grid/
│   │       │   ├── ClientesGrid.jsx                            # Tabla AG Grid + coordinación de toolbar y context
│   │       │   ├── ClientesGridToolbar.jsx                     # Barra: buscador, selector de columnas, exportar CSV
│   │       │   ├── agGridConfig.js                             # Locale español (40+ traducciones) + defaultColDef
│   │       │   └── useClientesColumnDefs.js                    # Hook que calcula columnas según visibilidad
│   │       └── modal/
│   │           ├── AgregarClienteModal.jsx                     # Formulario Bootstrap para crear un cliente
│   │           └── ConfirmarEliminacionModal.jsx               # Diálogo de confirmación antes de borrar
│   └── services/
│       ├── index.js                                            # Punto de importación único
│       ├── config/
│       │   └── apiClient.js                                    # Cliente HTTP centralizado: GET/POST/PUT/DELETE + manejo de errores
│       └── endpoints/
│           ├── clientes.js                                     # CRUD del endpoint /clientes
│           ├── citas.js                                        # CRUD del endpoint /citas
│           └── servicios.js                                    # CRUD del endpoint /servicios
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

## 🔮 Por implementar
- 📅 Módulo Home: Calendario (investigar librerías) de las citas de la semana. 
- 📋 Módulo Citas: Tabla con AG Grid como módulo clientes
- 💇 Módulo Servicios: Tabla con AG Grid como módulo clientes
- 📊 Módulo Informaciones: Gráficos (investigar librerías) con informaciones
