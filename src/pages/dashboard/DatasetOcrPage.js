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

  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseDown = (event) => {
    const rect = imageRef.current.getBoundingClientRect();
    setStartPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setDragging(true);
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;
    const rect = imageRef.current.getBoundingClientRect();
    setEndPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const handleMouseUp = () => {
    setDragging(false);
    console.log('Drag Area:', { startPos, endPos });
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
          <Card sx={{ width: 550 }}>
            <button
              type="button"
              ref={imageRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                padding: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <Image src={url} layout="responsive" width={550} height={350} draggable="false" />
              {dragging && (
                <div
                  style={{
                    position: 'absolute',
                    left: Math.min(startPos.x, endPos.x),
                    top: Math.min(startPos.y, endPos.y),
                    width: Math.abs(endPos.x - startPos.x),
                    height: Math.abs(endPos.y - startPos.y),
                    border: '1px solid red',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </button>
          </Card>
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
            <Typography variant="body1">{responseData}</Typography>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
