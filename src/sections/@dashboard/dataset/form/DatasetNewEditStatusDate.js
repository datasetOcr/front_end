import { useState } from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  'weekly',
  'every-other-week',
  'twice a month',
  'monthly',
  'quarterly',
  '-- Select Frequency --',
];

// ----------------------------------------------------------------------

export default function DatasetNewEditStatusDate() {
  const { control, watch } = useFormContext();

  const values = watch();

  const [selectedFrequency, setSelectedFrequency] = useState('-- Select Frequency --');

  const handleFrequencyChange = (event) => {
    setSelectedFrequency(event.target.value);
  };

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFSelect
        fullWidth
        name="Frequency"
        label="Pay Frequency"
        value={selectedFrequency} // Use the selectedFrequency state as the value
        onChange={handleFrequencyChange} // Update the state when the value changes
        InputLabelProps={{ shrink: true }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect>
      <Controller
        name="checkDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Check Date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
            )}
          />
        )}
      />
    </Stack>
  );
}
