import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';
import { AppProvider } from './store.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
        <Analytics />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);
