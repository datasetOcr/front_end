import sum from 'lodash/sum';
import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DatasetNewEditDetails() {
  const { setValue, watch } = useFormContext();

  const values = watch();

  const { datasetData } = values;

  console.log('------------datasetData-----------');

  const TaxInfo = ({ title, label, value, adornment, type }) => (
    <Stack sx={{ mt: 2 }} spacing={2}>
      <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
        {title}
      </Typography>
      <RHFTextField
        disabled
        size="small"
        label={label}
        name="title"
        value={value}
        InputProps={{
          startAdornment: <InputAdornment position="start">{adornment}</InputAdornment>,
        }}
        sx={{ maxWidth: { md: type } }}
      />
    </Stack>
  );

  TaxInfo.propTypes = {
    title: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.any,
    adornment: PropTypes.string,
    type: PropTypes.number,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: 'text.disabled', mb: 1 }}>
        Income Details:
      </Typography>
      <Typography variant="h7" sx={{ color: 'text.disabled' }}>
        Regular Pay
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, mt: 3 }}>
        <RHFTextField
          disabled
          size="small"
          name="regular"
          value={
            datasetData?.type === 1
              ? (datasetData.data?.regular || []).map((item) => item[3]).join(',   ')
              : (datasetData.data?.regular || []).map((item) => item[6]).join(',   ')
          }
          label="Regular"
          InputProps={{
            startAdornment: <InputAdornment position="start">w</InputAdornment>,
          }}
        />
        <RHFTextField
          disabled
          size="small"
          name="adjustment"
          value={
            datasetData?.type === 1
              ? (datasetData.data?.adjustment || [])
                  .map((item) => (item[1] > 100 ? null : item[2]))
                  .join(',   ')
              : (datasetData.data?.adjustment || [])
                  .map((item) => (item[1] > 100 ? null : item[2]))
                  .join(',   ')
          }
          label="Adjustment"
          InputProps={{
            startAdornment: <InputAdornment position="start">w</InputAdornment>,
          }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, mt: 3 }}>
        <RHFTextField
          disabled
          size="small"
          name="commission"
          label="Commission"
          value={
            datasetData?.type === 1
              ? (datasetData.data?.commission || [])
                  .map((item) => (item[1] > 100 ? null : item[2]))
                  .join(',   ')
              : (datasetData.data?.commission || [])
                  .map((item) => (item[1] > 100 ? null : item[6]))
                  .join(',   ')
          }
          InputProps={{
            startAdornment: <InputAdornment position="start">w</InputAdornment>,
          }}
        />
        <RHFTextField
          disabled
          size="small"
          name="holiday"
          value={
            datasetData?.type === 1
              ? (datasetData.data?.holiday || [])
                  .map((item) => (item[1] > 100 ? 0 : item[3]))
                  .join(',   ')
              : (datasetData.data?.holiday || [])
                  .map((item) => (item[1] > 100 ? 0 : item[3]))
                  .join(',   ')
          }
          label="Holiday"
          InputProps={{
            startAdornment: <InputAdornment position="start">w</InputAdornment>,
          }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, mt: 3 }}>
        <RHFTextField
          disabled
          size="small"
          name="paid"
          label="Paid Time off"
          value={
            datasetData?.type === 1
              ? (datasetData.data?.['Paid Time off'] || [])
                  .map((item) => (item[1] > 100 ? null : item[2]))
                  .join(',   ')
              : (datasetData.data?.['Paid Time off'] || [])
                  .map((item) => (item[1] > 100 ? null : item[2]))
                  .join(',   ')
          }
          InputLabelProps={{ shrink: true }}
        />

        <RHFTextField
          disabled
          size="small"
          name="total"
          label="Total"
          placeholder="0"
          value={(datasetData['Total Gross Pay'] || [''])[2] || ''}
          InputLabelProps={{ shrink: true }}
          sx={{ maxWidth: { md: 96 } }}
        />
      </Stack>
      <Stack direction="row" justifyContent="flex-end" gap={2}>
        <TaxInfo
          title="Overtime pay"
          label=""
          value={(datasetData['Overtime pay'] || [''])[0] || ''}
          adornment=""
          type={96}
        />
        <TaxInfo
          title="Total Income"
          label=""
          value={(datasetData['Total Income'] || [''])[0] || ''}
          adornment=""
          type={96}
        />
      </Stack>
      <Typography variant="h5" sx={{ color: 'text.disabled', mb: 1, mt: 5 }}>
        Deductions
      </Typography>
      <TaxInfo
        title="Federal Tax"
        label="Federal Income Tax"
        value={
          datasetData?.type === 1
            ? (datasetData.data?.['federal income tax'] || [])
                .map((item) => (item[1] > 100 ? null : item[1]))
                .join(',   ')
            : (datasetData.data?.['federal income tax'] || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
        }
        adornment=""
      />
      <TaxInfo
        title="State Tax"
        label="Colorado SITW"
        value={
          datasetData?.type === 1
            ? (datasetData.data?.['Colorado SITW'] || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
            : (datasetData.data?.['Colorado SITW'] || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
        }
        adornment=""
      />
      <TaxInfo
        title="Medicare"
        label="Medicare"
        value={
          datasetData?.type === 1
            ? (datasetData.data?.medicare || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
            : (datasetData.data?.medicare || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
        }
        adornment=""
      />
      <TaxInfo
        title="Social Security"
        label="OASDI"
        value={
          datasetData?.type === 1
            ? (datasetData.data?.OASDI || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
            : (datasetData.data?.OASDI || [])
                .map((item) => (item[1] > 100 ? null : item[2]))
                .join(',   ')
        }
        adornment=""
      />
      <TaxInfo title="Mandatory Retirement" label="" value="0" adornment="" />
      <TaxInfo title="Voluntary Retirement" value="0" adornment="" />
      <TaxInfo title="Retirement Loan repayment" value="0" adornment="" />
      <TaxInfo title="Life Insurance" value="0" adornment="" />
      <TaxInfo title="Total Deductions" value="0" adornment="" />
      <TaxInfo
        title="Net Income"
        value={
          datasetData?.type === 1
            ? (datasetData.data?.['net pay'] || [])
                .map((item) => (item[1] > 100 ? null : item[1]))
                .join(',   ')
            : (datasetData.data?.['net pay'] || [])
                .map((item) => (item[1] > 100 ? null : item[1]))
                .join(',   ')
        }
        adornment=""
      />

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
    </Box>
  );
}
