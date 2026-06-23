import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAuthListener } from './configs/authListener.ts';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

//tanstack query to handle caching, refetching etc
const queryClient = new QueryClient();
initAuthListener();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
