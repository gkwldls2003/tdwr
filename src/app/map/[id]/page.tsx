'use client'

import { useEffect, useState } from "react";
import { Markers } from "../../../../store/types/marker";
import { selectMarkerInfoQuery } from "../../../../common/querys/map/page";

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
            setMarker(selectMarkerInfo.data);
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <span className="font-bold">가격:</span> 
        </div>
        <div className="mb-4">
          <span className="font-bold">설명:</span>
          <p className="mt-2 text-gray-600"></p>
        </div>
      </div>
    </div>
  );
}