import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <App />
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(async (registrations) => {
    await Promise.all(registrations.map(r => r.unregister()));
    navigator.serviceWorker.register('/sw.js?v=3').catch(() => {});
  });
}
