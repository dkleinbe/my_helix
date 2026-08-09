import ThemeProvider from './pages/system/theme-provider';
import { RouterProvider, Route, Routes, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { router } from './pages/system/app-router';
import HelixSpotlight from './config/spotlight.tsx';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './components/auth/auth-provider.tsx';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

const Helix = () => (
  <MantineProvider>
    <ModalsProvider>
      <ThemeProvider>
        <Notifications />
          <AuthProvider>
              <RouterProvider router={router} />
          </AuthProvider>
      </ThemeProvider>
    </ModalsProvider>
  </MantineProvider>
);

export default Helix;
