import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.css'

// Registra todos los módulos de AG Grid (necesario antes del primer render)
ModuleRegistry.registerModules([AllCommunityModule])

createRoot(document.getElementById('root')).render(
  // StrictMode ejecuta cada componente dos veces en desarrollo
  // para detectar efectos secundarios inesperados
  <StrictMode>
    <App />
  </StrictMode>,
)
