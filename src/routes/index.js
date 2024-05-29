import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Dashboard: Dataset
  DatasetListPage,
  DatasetDetailsPage,
  DatasetCreatePage,
  DatasetEditPage,
  //
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Dashboard
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },

        {
          path: 'dataset',
          children: [
            { element: <Navigate to="/dashboard/dataset/list" replace />, index: true },
            { path: 'list', element: <DatasetListPage /> },
            { path: ':id', element: <DatasetDetailsPage /> },
            { path: ':id/edit', element: <DatasetEditPage /> },
            { path: 'new', element: <DatasetCreatePage /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      element: <DashboardLayout />,
      children: [{ element: <DatasetCreatePage />, index: true }],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
