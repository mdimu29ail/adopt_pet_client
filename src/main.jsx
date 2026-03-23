import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import router from './Router/Router.jsx';
import AuthProvider from './Auth/AuthProvider.jsx';
import { RouterProvider } from 'react-router';

import 'aos/dist/aos.css';
import Aos from 'aos';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

Aos.init();
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
