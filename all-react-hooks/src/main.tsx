import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeContext } from './UseContext/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContext.Provider value="dark">
      <App />
    </ThemeContext.Provider>
  </StrictMode>,
)
