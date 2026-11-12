import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header'
import Nutricion from './components/Nutricion/Nutricion'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header>
      <Nutricion />
    </Header>
  </StrictMode>,
)
