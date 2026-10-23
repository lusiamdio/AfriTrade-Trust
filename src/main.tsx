import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-refresh support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New update available');
  },
  onOfflineReady() {
    console.log('[PWA] Application ready for offline trade exploration');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

