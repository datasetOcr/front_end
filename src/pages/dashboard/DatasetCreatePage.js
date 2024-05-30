import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import DatasetNewEditForm from '../../sections/@dashboard/dataset/form';

// ----------------------------------------------------------------------

export default function DatasetCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Dataset: Create a new dataset | Parser</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new dataset"
          links={[
            {
              name: 'Dataset',
              // href: PATH_DASHBOARD.dataset.list,
            },
            {
              name: 'New dataset',
            },
          ]}
        />

        <DatasetNewEditForm />
      </Container>
    </>
  );
}
