'use client'

import axios from "axios";
import Script from "next/script"
import { useEffect, useState } from "react";
import { NavermapsProvider  } from 'react-naver-maps'
import $ from "jquery";
import dynamic from 'next/dynamic';

//react-naver-maps/dist/chunk-SENI7KNJ.mjs SSR 환경에서 임포트하면 오류나서 false 처리
const MyMap = dynamic(() => import('./myMap'), { ssr: false });

export default function Map() {

  const client_id:string = `${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`

    return (
    <>
    <NavermapsProvider 
      ncpClientId={client_id}
      // or finClientId, govClientId  
    >
      <MyMap></MyMap>
    </NavermapsProvider>
     
    </>
  )
}