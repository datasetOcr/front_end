import { Helmet } from 'react-helmet-async';
import AWS from 'aws-sdk';
import { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Table, Button, TableBody, Container, TableContainer } from '@mui/material';
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
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
// sections
import DatasetAnalytic from '../../sections/@dashboard/dataset/DatasetAnalytic';
import { DatasetTableRow, DatasetTableToolbar } from '../../sections/@dashboard/dataset/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'name', label: 'File Name', align: 'left' },
  { id: 'lastModified', label: 'Last Modified', align: 'left' },
  { id: 'size', label: 'Size', align: 'left' },
];

AWS.config.update({
  region: REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

// ----------------------------------------------------------------------

export default function DatasetListPage() {
  const theme = useTheme();
  const s3 = new AWS.S3();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [isAnalyze, setIsAnalyze] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState(null);

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const handleFileChange = (event) => {
    const fileList = event.target.files;
    const folderList = [];
    for (let i = 0; i < fileList.length; i += 1) {
      const file = fileList[i];
      if (file.webkitRelativePath && file.webkitRelativePath.indexOf('/') !== -1) {
        // If the file has a path, it's a directory
        folderList.push(file);
      }
    }
    // Now folderList contains only directories, do whatever you need with them
    setTableData(folderList);
    console.log(folderList);
  };

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handlePublish = async () => {
    try {
      console.log('clicked');
      setIsAnalyze(true);
      const files = tableData;

      const uploadFile = async (file) => {
        const params = {
          Bucket: AWS_S3_BUCKET,
          Key: `dataset/${file.name}`,
          ContentType: file.type,
        };

        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
      };
      const uploadPromises = Array.from(files).map((file) => uploadFile(file));

      await Promise.all(uploadPromises);

      console.log('Files uploaded successfully');
      setIsAnalyze(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
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
              href: PATH_DASHBOARD.root,
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

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DatasetTableRow key={row.lastModified} row={row} />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = inputData.map((el, index) => ({ data: el, index }));

  stabilizedThis.sort((a, b) => {
    const order = comparator(a.data, b.data);
    if (order !== 0) return order;
    return a.index - b.index;
  });

  inputData = stabilizedThis.map((el) => el.data);

  if (filterName) {
    inputData = inputData.filter(
      (dataset) =>
        dataset.datasetNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        dataset.datasetTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((dataset) => dataset.status === filterStatus);
  }

  if (filterService !== 'all') {
    inputData = inputData.filter((dataset) =>
      dataset.items.some((c) => c.service === filterService)
    );
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (dataset) =>
        fTimestamp(dataset.createDate) >= fTimestamp(filterStartDate) &&
        fTimestamp(dataset.createDate) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
