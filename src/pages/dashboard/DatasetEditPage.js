import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _dataset } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import DatasetNewEditForm from '../../sections/@dashboard/dataset/form';

// ----------------------------------------------------------------------

export default function DatasetEditPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();

  const currentDataset = _dataset.find((dataset) => dataset.id === id);

  return (
    <>
      <Helmet>
        <title> Dataset: Edit | Parser</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit dataset"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Dataset',
              href: PATH_DASHBOARD.dataset.list,
            },
            { name: `INV-${currentDataset?.datasetNumber}` },
          ]}
        />

        <DatasetNewEditForm isEdit currentDataset={currentDataset} />
      </Container>
    </>
  );
}
