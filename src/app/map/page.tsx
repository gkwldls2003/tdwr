'use client'

import { NavermapsProvider  } from 'react-naver-maps'
import dynamic from 'next/dynamic';
import { Box, Stack } from '@mui/material';
import LeftSider from './LeftSider';

//react-naver-maps/dist/chunk-SENI7KNJ.mjs SSR 환경에서 임포트하면 오류나서 false 처리
const MyMap = dynamic(() => import('./myMap'), { ssr: false });

export default function Map() {

  const client_id:string = `${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`

    return (
    <>
      <Stack direction={'row'} height={'1000px'}>
        <Box
          sx={{
            width: '500px',
            overflowY: 'auto',
            height: '100%',
          }}>
          <LeftSider/>
        </Box>
        <NavermapsProvider 
          ncpClientId={client_id}
          // or finClientId, govClientId  
        >
          <MyMap></MyMap>
        </NavermapsProvider>
      </Stack>
    </>
  )
}