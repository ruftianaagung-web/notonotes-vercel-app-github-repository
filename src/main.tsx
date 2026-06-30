import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './store.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

window.addEventListener('error', (e) => {
  document.body.innerHTML += `<div style="color:red;z-index:9999;position:fixed;top:0;left:0;background:white;padding:20px;max-width:100vw;word-wrap:break-word;">Global Error: ${e.message}<br/>${e.filename}:${e.lineno}</div>`;
});

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += `<div style="color:red;z-index:9999;position:fixed;top:50px;left:0;background:white;padding:20px;max-width:100vw;word-wrap:break-word;">Promise Error: ${e.reason}</div>`;
});

if ('serviceWorker' in navigator) {
  try {
    registerSW({ immediate: true });
  } catch (e) {
    console.error('Service Worker registration failed:', e);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);
