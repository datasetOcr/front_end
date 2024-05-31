// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },

  dataset: {
    root: path(ROOTS_DASHBOARD, '/dataset'),
    list: path(ROOTS_DASHBOARD, '/dataset/list'),
    new: path(ROOTS_DASHBOARD, '/dataset/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/dataset/ocr/${id}`),
    // view: (id) => path(ROOTS_DASHBOARD, `/dataset/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/dataset/${id}/edit`),
  },
};
