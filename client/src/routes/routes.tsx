import { Index } from '../pages/index/Index.tsx';
import { IndexLayout } from '../pages/index/IndexLayout.tsx';
import { Register } from '../pages/index/Register.tsx';
import { ErrorRoute } from '../pages/ErrorRoute.tsx';
import { Login } from '../pages/index/Login.tsx';
import type { RouteObject } from 'react-router';
import { HomeLayout } from '../pages/home/HomeLayout.tsx';
import { Home } from '../pages/home/Home.tsx';
import { Dashboard } from '../pages/home/Dashboard.tsx';
import { AdminLayout } from '../pages/admin/AdminLayout.tsx';
import { AdminHome } from '../pages/admin/AdminHome.tsx';
import { EmployeesList } from '../pages/admin/EmployeesList.tsx';

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
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <ErrorRoute />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: 'employees',
        element: <EmployeesList />,
      },
    ],
  },
];
//TODO FIX ABSOLUTE PATH  HOME DASHBOARD
