import PropTypes from 'prop-types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, FormHelperText } from '@mui/material';
//
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import FormProvider, { RHFUploadPdf } from '../../../../components/hook-form';
import { AWS_S3_BUCKET } from '../../../../config-global';
//
import DatasetNewEditDetails from './DatasetNewEditDetails';
import DatasetNewEditAddress from './DatasetNewEditAddress';
import DatasetNewEditStatusDate from './DatasetNewEditStatusDate';

// ----------------------------------------------------------------------

DatasetNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentDataset: PropTypes.object,
};

export default function DatasetNewEditForm({ isEdit, currentDataset }) {
  const navigate = useNavigate();

  const [isUpload, setIsUpload] = useState(false);

  const [dropped, setDropped] = useState(null);

  const [isAnalyze, setIsAnalyze] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const [err, setError] = useState(false);

  const [ocrData, setOcrData] = useState([]);

  const [keyData, setKeyData] = useState({});

  const NewUserSchema = Yup.object().shape({
    datasetTo: Yup.mixed().required('Dataset to is required'),
    dueDate: Yup.date().min(Yup.ref('createDate'), 'Due date must be later than create date'),
  });

  const defaultValues = useMemo(
    () => ({
      datasetData: ocrData,
    }),
    [ocrData]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [ocrData, defaultValues, reset]);

  const handleCreateAndSend = async (data) => {
    setLoadingSend(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      setLoadingSend(false);
      navigate(PATH_DASHBOARD.dataset.list);
      console.log('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setLoadingSend(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsAnalyze(true);
      const folder = 'dataset/';
      const data = {
        key: folder + Date.now().toString(),
        values,
      };
      const preSignedURL = await axios.post('/dataset/presignedUrl', data);
      const myHeaders = new Headers({
        'Content-Type': 'blob',
      });
      let response;

      const blob = await response.blob();
      console.log('blob====', blob);
      await fetch(preSignedURL.data.signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: blob,
      });
      const formData = {
        url: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${data.key}`,
        type: dropped,
      };
      const responseOCR = await axios.post('/dataset/analyze', formData);

      console.log('=========responseOCR.data====', responseOCR.data);

      if (responseOCR.data === 'Error') {
        setError(true);
      } else {
        const temp = {
          data: responseOCR.data,
          type: dropped,
        };
        setOcrData(temp);
      }
      setIsAnalyze(false);
      setIsUpload(false);
      setDropped(null);
      // return imageUrlList;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles, type) => {
      console.log('--acceptedFiles--', acceptedFiles, type);
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        // Check if file exists before proceeding
        if (type === 1) {
          setDropped(1);
          setIsUpload(true);
          setValue('Formfiles', newFile, { shouldValidate: true });
        } else {
          setDropped(2);
          setIsUpload(true);
          setValue('Tablefiles', newFile, { shouldValidate: true });
        }
      }
    },
    [setValue, setDropped]
  );

  const handleRemoveFile = () => {
    setIsUpload(false);
    setDropped(null);
    setValue('Formfiles', null);
    setValue('Tablefiles', null);
  };

  return (
    <FormProvider methods={methods}>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <RHFUploadPdf
          disabled={dropped === 2}
          name="Formfiles"
          type="(General Format)"
          maxSize={999999999}
          onDrop={(acceptedFiles) => handleDrop(acceptedFiles, 1)}
          onRemove={handleRemoveFile}
        />
        <RHFUploadPdf
          disabled={dropped === 1}
          name="Tablefiles"
          type="(Table Foramt)"
          maxSize={999999999}
          onDrop={(acceptedFiles) => handleDrop(acceptedFiles, 2)}
          onRemove={handleRemoveFile}
        />
      </Stack>
      {err && (
        <FormHelperText sx={{ px: 2, textAlign: 'center' }}>
          Request has unsupported document format
        </FormHelperText>
      )}
      {isUpload && (
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Button variant="contained" sx={{ width: '160px' }} onClick={() => handleRemoveFile()}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={isAnalyze}
            sx={{ width: '160px' }}
            onClick={() => handlePublish()}
          >
            Analyze
          </LoadingButton>
        </Stack>
      )}

      <Card sx={{ mt: 5 }}>
        <DatasetNewEditStatusDate />
        {/* <DatasetNewEditAddress /> */}

        <DatasetNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {/* <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          Save as Draft
        </LoadingButton> */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          Save
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
