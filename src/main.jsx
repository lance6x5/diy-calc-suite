import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import './styles.css';

import { initInstallButton } from './install.js';

// Offer an "Install app" button when the browser allows it and the app isn't installed yet.
initInstallButton({ appName: 'Measure Twice', selector: '.app-header' });

// Register the service worker (caches the app shell for offline use).
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
