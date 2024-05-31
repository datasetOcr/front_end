import { Suspense, lazy } from 'react';
// components

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// DASHBOARD: dataset
export const DatasetListPage = Loadable(lazy(() => import('../pages/dashboard/DatasetListPage')));

export const DatasetCreatePage = Loadable(
  lazy(() => import('../pages/dashboard/DatasetCreatePage'))
);
export const DatasetOcrPage = Loadable(lazy(() => import('../pages/dashboard/DatasetOcrPage')));
