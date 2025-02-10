'use client'

import { useEffect, useState } from "react";
import { Markers } from "../../../store/types/marker";
import { selectMarkerInfoQuery } from "../../../common/querys/map/page";
import { NavermapsProvider } from "react-naver-maps";
import DetailMap from "./detailMap";
import { useDispatch } from "react-redux";
import { setShowLeftSider } from "../../../store/layoutSlice";
import { Box, Container, Paper, Stack, styled, Typography } from "@mui/material";

type Props = {
  params: {
    id: string;
  };
};

export default function DetailPage({ params }: Props) {
  const ncpClientId = `${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`
  const dispatch = useDispatch();
  const [marker, setMarker] = useState<Markers | null>(null);
  const { id } = params;

  const fetchMarker = async () => {
    try {
      const selectMarkerInfo = await selectMarkerInfoQuery(id);
      if (selectMarkerInfo) {
        setMarker(selectMarkerInfo);
      } else {
        console.error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching marker data:', error);
    }
  };

  useEffect(() => {
    dispatch(setShowLeftSider(false));
    return () => {
      dispatch(setShowLeftSider(true));
    };
  }, [dispatch]);

  useEffect(() => {
    fetchMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ContentWrapper = styled(Box)(({ theme }) => ({
    minHeight: `calc(100vh - ${theme.spacing(16)})`,
  }));
  
  return (
    <ContentWrapper>
      <Container
        maxWidth="lg" 
        sx={{ 
          py: 8,
          height: '100%',
          overflowY: 'auto'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 1,
            overflow: 'hidden',
            mb: 8 
          }}
        >
            <Box
            sx={{
              width: '100%',
              height: '384px',
              position: 'relative',
            }}
            >
            <NavermapsProvider ncpClientId={ncpClientId}>
              {marker && <DetailMap marker={marker} />}
            </NavermapsProvider>
            </Box>

          <Stack spacing={6} sx={{ p: 6 }}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'grey.200',
              pb: 6 
            }}>
              <Typography
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.primary',
                  mb: 4 
                }}
              >
                {marker?.name}
              </Typography>
              
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main'
                  }}
                >
                  {marker && `₩${marker.price.toLocaleString()}`}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={6}>
              <Box>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: 'grey.50',
                    p: 4 
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      lineHeight: 1.7 
                    }}
                  >
                    {marker?.description}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </ContentWrapper>
  );
}