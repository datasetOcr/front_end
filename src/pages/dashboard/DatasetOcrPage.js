import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import AWS from 'aws-sdk';

import { Link as useNavigate, useLocation } from 'react-router-dom';
// @mui
import { Card, Container, Typography, Stack, Box } from '@mui/material';
//

import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import Image from '../../components/image';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections

// ----------------------------------------------------------------------

AWS.config.update({
  region: REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

// ----------------------------------------------------------------------

export default function DatasetOcrPage() {
  const location = useLocation();
  const { url, responseData } = location.state || {};

  console.log('---------responseData-----------', responseData);
  console.log('----------------url-------------------', url);
  const { themeStretch } = useSettingsContext();

  const [selection, setSelection] = useState(null);
  const [selectedText, setSelectedText] = useState([]);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    setSelection({
      startX: (e.clientX - rect.left) / rect.width,
      startY: (e.clientY - rect.top) / rect.height,
      endX: null,
      endY: null,
    });
  };

  const handleMouseMove = (e) => {
    if (!selection) return;
    const rect = imageRef.current.getBoundingClientRect();
    setSelection((prevSelection) => ({
      ...prevSelection,
      endX: (e.clientX - rect.left) / rect.width,
      endY: (e.clientY - rect.top) / rect.height,
    }));
  };

  const handleMouseUp = () => {
    if (!selection) return;
    const { startX, startY, endX, endY } = selection;
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const right = Math.max(startX, endX);
    const bottom = Math.max(startY, endY);

    const selected = responseData
      .filter((block) => {
        const { Width, Height, Left, Top } = block.geometry;
        return Left >= left && Top >= top && Left + Width <= right && Top + Height <= bottom;
      })
      .map((block) => block.text);

    setSelectedText(selected);
    setSelection(null);
  };

  return (
    <>
      <Helmet>
        <title> Dataset: OCR | Parser</title>
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
              name: 'OCR',
            },
          ]}
        />
        <Typography variant="subtitle2" noWrap>
          Upload List
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1, mt: 3 }}>
          <div>
            <Card sx={{ width: 550 }}>
              <div
                ref={imageRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                role="presentation"
                style={{ position: 'relative', cursor: 'crosshair' }}
              >
                <Image src={url} layout="responsive" width={550} height={350} draggable="false" />
                {selection && (
                  <div
                    style={{
                      position: 'absolute',
                      border: '1px solid blue',
                      left: `${Math.min(selection.startX, selection.endX) * 100}%`,
                      top: `${Math.min(selection.startY, selection.endY) * 100}%`,
                      width: `${Math.abs(selection.endX - selection.startX) * 100}%`,
                      height: `${Math.abs(selection.endY - selection.startY) * 100}%`,
                    }}
                  />
                )}
              </div>
            </Card>
          </div>
          <Box
            sx={{
              width: 500,
              height: 500,
              border: '1px solid black',
              display: 'flex', // added to center content
              alignItems: 'center', // added to center content
              justifyContent: 'center', // added to center content
              padding: 2, // added padding for better appearance
            }}
          >
            {selectedText.length > 0 && (
              <div>
                <h3>Selected Text:</h3>
                <ul>
                  {selectedText.map((text, index) => (
                    <li key={index}>{text}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* <Typography variant="body1">{responseData}</Typography> */}
          </Box>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
