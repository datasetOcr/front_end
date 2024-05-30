import PropTypes from 'prop-types';
// @mui
import { Stack, TableRow, TableCell, Typography, Avatar } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import Image from '../../../../components/image';
import { AWS_S3_BUCKET } from '../../../../config-global';

// ----------------------------------------------------------------------

DatasetTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  state: PropTypes.number,
};

export default function DatasetTableRow({ row, selected, state }) {
  const { type, name, lastModified, size, folder, detailData, imageData } = row;

  const data = `https://${AWS_S3_BUCKET}.s3.us-east-1.amazonaws.com/${folder}/${imageData[0]?.name}`;

  console.log('===========row=============', data);
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
          <TableCell>
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
