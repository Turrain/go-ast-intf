import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto';
import { StyledEngineProvider } from '@mui/joy';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
    
  </StrictMode>,
)
