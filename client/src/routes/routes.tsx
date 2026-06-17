import { Index } from '../pages/index/Index.tsx';
import { IndexLayout } from '../pages/index/IndexLayout.tsx';
import { Register } from '../pages/index/Register.tsx';
import { ErrorRoute } from '../pages/ErrorRoute.tsx';
import { Login } from '../pages/index/Login.tsx';
import type { RouteObject } from 'react-router';
import { HomeLayout } from '../pages/home/HomeLayout.tsx';
import { Home } from '../pages/home/Home.tsx';
import { Dashboard } from '../pages/home/Dashboard.tsx';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <IndexLayout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorRoute />,
  },
  {
    path: '/home',
    element: <HomeLayout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/home/dashboard',
        element: <Dashboard />,
      },
    ],
  },
];
