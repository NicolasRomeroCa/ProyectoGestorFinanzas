// src/main.jsx
import { StrictMode } from 'react' // Asegúrate de importar StrictMode
import { createRoot } from 'react-dom/client' // Asegúrate de importar createRoot
import './index.css' // Asegúrate de importar los estilos globales
import App from './App.jsx' // Asegúrate de importar el componente App

// Renderiza la aplicación dentro del elemento con id 'root'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* Renderiza el componente App dentro de StrictMode */}
  </StrictMode>,
)
