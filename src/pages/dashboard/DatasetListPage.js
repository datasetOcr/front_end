import { Helmet } from 'react-helmet-async';
import AWS from 'aws-sdk';
import { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';
//
import axios from '../../utils/axios';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  REGION,
} from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
} from '../../components/table';
// sections

import { DatasetTableRow } from '../../sections/@dashboard/dataset/list';

// ----------------------------------------------------------------------

const TABLE_HEAD_1 = [
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'name', label: 'File Name', align: 'left' },
  { id: 'lastModified', label: 'Last Modified', align: 'left' },
  { id: 'size', label: 'Size', align: 'left' },
];

const TABLE_HEAD_2 = [
  { id: 'thumb', label: 'Thumb', align: 'left' },
  { id: 'source', label: 'Source', align: 'left' },
  { id: 'text', label: 'Text Preview', align: 'left' },
  { id: 'progress', label: 'progress', align: 'left' },
];

AWS.config.update({
  region: REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

// ----------------------------------------------------------------------

export default function DatasetListPage() {
  const s3 = new AWS.S3();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const { dense, page, order, orderBy, rowsPerPage, selected, onSort } = useTable({
    defaultOrderBy: 'createDate',
  });

  const [uploadTableData, setUploadTableData] = useState([]);

  const [uploadedTableData, setUploadedTableData] = useState([]);

  const [isAnalyze, setIsAnalyze] = useState(false);

  const [upDate, setUpdate] = useState(false);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setUpdate(true);
    }
  };

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    const folderList = [];
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      if (file.webkitRelativePath && file.webkitRelativePath.indexOf('/') !== -1) {
        folderList.push(file);
      }
    }
    setUploadTableData(folderList);
    console.log(folderList);
  };

  const denseHeight = dense ? 56 : 76;

  const handlePublish = async () => {
    try {
      console.log('clicked');
      setIsAnalyze(true);
      const files = uploadTableData;
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');

      // Create a unique folder name with the base name and timestamp
      const folder = `dataset/${uploadTableData[0].name
        .split('.')
        .slice(0, -1)
        .join('.')}_${timestamp}`;

      const uploadFile = async (file) => {
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: `${folder}/${file.name}`,
          ContentType: file.type,
        };

        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        console.log(
          '---------uploadUrl--------',
          `https://${params.Bucket}.s3.us-east-1.amazonaws.com/${params.Key}`
        );

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
      };
      const uploadPromises = Array.from(files).map((file) => uploadFile(file));

      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      console.log('=======imageFiles======', imageFiles);

      await Promise.all(uploadPromises);

      const uploadedData = {
        folder,
        detailData: files,
        imageData: imageFiles,
      };
      setUploadedTableData((prev) => [...prev, uploadedData]);
      setUploadTableData([]);
      console.log('Files uploaded successfully', uploadedData);
      setUpdate(false);
      setIsAnalyze(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Dataset: Upload | Parser</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Dataset Upload"
          links={[
            {
              name: 'Dashboard',
            },
            {
              name: 'Dataset',
              href: PATH_DASHBOARD.dataset.root,
            },
            {
              name: 'Upload',
            },
          ]}
          action={
            <>
              <LoadingButton
                disabled={!upDate}
                variant="contained"
                loading={isAnalyze}
                sx={{ width: '160px', marginRight: 2 }}
                onClick={() => handlePublish()}
              >
                Upload all dataset
              </LoadingButton>

              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleButtonClick}
              >
                Data Set Add
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                directory="true"
                webkitdirectory="true"
              />
            </>
          }
        />
        <Typography variant="subtitle2" noWrap>
          Upload List
        </Typography>
        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_1}
                  rowCount={uploadTableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {uploadTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DatasetTableRow key={row.lastModified} row={row} state={1} />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, uploadTableData.length)}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
        <Typography variant="subtitle2" noWrap sx={{ mt: 2 }}>
          Uploaded List
        </Typography>
        <Card sx={{ mt: 2 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD_2}
                  rowCount={uploadedTableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {uploadedTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DatasetTableRow key={row.folder} row={row} state={2} />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, uploadedTableData.length)}
                  />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
