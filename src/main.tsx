import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SloProvider } from './contexts/SloProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SloProvider>
      <App />
    </SloProvider>
  </StrictMode>
);
