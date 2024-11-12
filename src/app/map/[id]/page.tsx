'use client'

import { useEffect, useState } from "react";
import { Markers } from "../../../../store/types/marker";
import { selectMarkerInfoQuery } from "../../../../common/querys/map/page";
import Map from "../page";
import MyMap from "../myMap";
import { NavermapsProvider } from "react-naver-maps";
import DetailMap from "./detailMap";

type Props = {
    params: {
      id: string;
    };
  };

export default function DetailPage({ params }: Props) {
  const [marker,setMarker]=useState<Markers[]>([]);
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
    fetchMarker();
  }, []);  // 빈 배열로 fetchMarker를 한 번만 실행

  console.log(marker);

  return (
    <div className="">
      <h1 className="text-2xl font-bold"></h1>
      <div className="w-full h-96 mb-4">
  <NavermapsProvider ncpClientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}>
    <DetailMap marker={marker} />
  </NavermapsProvider>
</div>
      
      <div className="bg-white shadow-md">
        <div className="mb-4">
        
          <span className="font-bold">가격:{marker.price}</span> 
        </div>
        <div className="">
          <span className="font-bold">하는일:{marker.name}</span>
          <p className="mt-2 text-gray-600"></p>
        </div>
        <div className="mb-4">
          <span className="font-bold">설명:{marker.description}</span>
          <p className="mt-2 text-gray-600"></p>
        </div>
      </div>
    </div>
  );
}