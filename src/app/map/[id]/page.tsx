'use client'

import { useEffect, useState } from "react";
import { Markers } from "../../../store/types/marker";
import { selectMarkerInfoQuery } from "../../../common/querys/map/page";
import { NavermapsProvider } from "react-naver-maps";
import DetailMap from "./detailMap";
import { useDispatch } from "react-redux";
import { setShowLeftSider } from "../../../store/layoutSlice";

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

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(space.16))]">
      <div className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="w-full h-96 relative">
            <NavermapsProvider ncpClientId={ncpClientId}>
              {marker && <DetailMap marker={marker} />}
            </NavermapsProvider>
          </div>

          <div className="p-6 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {marker?.name}
              </h1>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-blue-600">
                  {marker && `₩${marker.price.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">설명</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {marker?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}