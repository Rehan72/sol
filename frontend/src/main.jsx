import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
registerSW({ immediate: true })

// Scroll to top on page load
window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
})

// Scroll to top when navigating to a new page
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0)
})

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
