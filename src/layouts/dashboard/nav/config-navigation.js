// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// ----------------------------------------------------------------------

const navConfig = [
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // dataset
      {
        title: 'dataset',
        path: PATH_DASHBOARD.dataset.root,
        children: [
          { title: 'Datset upload', path: PATH_DASHBOARD.dataset.list },
          // { title: 'details', path: PATH_DASHBOARD.dataset.demoView },
          // { title: 'create', path: PATH_DASHBOARD.dataset.new },
          // { title: 'edit', path: PATH_DASHBOARD.dataset.demoEdit },
        ],
      },
    ],
  },
];

export default navConfig;
