import PropTypes from 'prop-types';
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button, Grid } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
import { _datasetAddressFrom } from '../../../../_mock/arrays';
// components
import Iconify from '../../../../components/iconify';
//
import DatasetAddressListDialog from './DatasetAddressListDialog';

// ----------------------------------------------------------------------

export default function DatasetNewEditAddress() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const upMd = useResponsive('up', 'md');

  const values = watch();

  const { datasetData } = values;

  return (
    <Stack
      spacing={{ xs: 2, md: 5 }}
      direction={{ xs: 'column', md: 'row' }}
      divider={
        <Divider
          flexItem
          orientation={upMd ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed' }}
        />
      }
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            Employer
          </Typography>
        </Stack>

        <EmpInfo
          emp_id={(datasetData['Emp Id'] || [''])[0]}
          loc={(datasetData.Loc || [''])[0]}
          status={(datasetData.Status || [''])[0]}
          date={(datasetData['Hire Date'] || [''])[0]}
        />
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

EmpInfo.propTypes = {
  emp_id: PropTypes.string,
  loc: PropTypes.string,
  status: PropTypes.string,
  date: PropTypes.string,
};

function EmpInfo({ emp_id, loc, status, date }) {
  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <Grid container alignItems="center" gap={1}>
          <Typography variant="body2">Emp Id :</Typography>
          <Typography variant="subtitle2">{emp_id}</Typography>
        </Grid>
        <Grid container alignItems="center" gap={1}>
          <Typography variant="body2">Loc :</Typography>
          <Typography variant="subtitle2">{loc}</Typography>
        </Grid>
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
        <Grid container alignItems="center" gap={1}>
          <Typography variant="body2">Status :</Typography>
          <Typography variant="subtitle2">{status}</Typography>
        </Grid>
        <Grid container alignItems="center" gap={1}>
          <Typography variant="body2">Hire Date :</Typography>
          <Typography variant="subtitle2">{date}</Typography>
        </Grid>
      </Stack>
    </>
  );
}
