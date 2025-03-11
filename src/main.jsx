import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'  // Import the base Tailwind CSS file first
import './index.css'     // Then import your custom CSS
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
