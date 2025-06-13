import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import this
import App from './App.tsx';
import './index.css';

// ✅ Wrap App in BrowserRouter with correct basename
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/Naanu-Raitha">
    <App />
  </BrowserRouter>
);

// ✅ Service Worker registration (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Naanu-Raitha/service-worker.js') // 🔥 key change here
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
