import PropTypes from 'prop-types';
// @mui
import { Stack, TableRow, TableCell, Typography, Avatar } from '@mui/material';
// utils
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import { fDate } from '../../../../utils/formatTime';
import axios from '../../../../utils/axios';
import Image from '../../../../components/image';
import { AWS_S3_BUCKET } from '../../../../config-global';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

DatasetTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  state: PropTypes.number,
};

export default function DatasetTableRow({ row, selected, state }) {
  const navigate = useNavigate();

  const { type, name, lastModified, size, folder, detailData, imageData } = row;

  const handleCellClick = async () => {
    const param = imageData[0].name;
    const url = `https://${AWS_S3_BUCKET}.s3.us-east-1.amazonaws.com/${folder}/${imageData[0].name}`;
    const data = { url };
    const responseOCR = await axios.post('/paystub/analyze', data);
    console.log('---------responseOCR-----------', responseOCR.data);
    navigate(PATH_DASHBOARD.dataset.view(paramCase(folder)), {
      state: { url, responseData: responseOCR.data },
    });
  };

  return (
    <TableRow hover selected={selected}>
      {state === 1 ? (
        <>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              <div>
                <Typography variant="subtitle2" noWrap>
                  {type}
                </Typography>
              </div>
            </Stack>
          </TableCell>

          <TableCell align="left">{name}</TableCell>

          <TableCell align="left">{fDate(lastModified)}</TableCell>

          <TableCell align="left">{size}</TableCell>
        </>
      ) : (
        <>
          <TableCell onClick={handleCellClick} style={{ cursor: 'pointer' }}>
            <Image
              src={`https://${AWS_S3_BUCKET}.s3.us-east-1.amazonaws.com/${folder}/${imageData[0].name}`}
              sx={{ width: 150, height: 300 }}
            />
          </TableCell>

          <TableCell align="left">{`s3.us-east-1.amazonaws.com/${folder}`}</TableCell>

          <TableCell align="left">Inprogress</TableCell>

          <TableCell align="left">Inprogress</TableCell>
        </>
      )}
    </TableRow>
  );
}
