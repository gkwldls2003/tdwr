'use client'

import { Container as MapDiv, NaverMap, Marker, useNavermaps, useMap } from 'react-naver-maps'
import axios from "axios";
import { useState, useEffect } from 'react';
import { makeMarkerClustering } from '../../../common/utils/marker-cluster'

interface Marker {
  latitude: number;
  longitude: number;
}

function MarkerCluster():any {

  const navermaps = useNavermaps()
  const map = useMap()
  const MarkerClustering = makeMarkerClustering(window.naver)
  const [markers, setMarkers] = useState<Marker[]>([]);

  const fetchMarkers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_DB_JSON}/markers`);
      setMarkers(res.data);
    } catch (error) {
      console.error("마커를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  const htmlMarkers = [
    {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-1.png);background-size:contain;"></div>',
      size: new navermaps.Size(40, 40),
      anchor: new navermaps.Point(20, 20),
    },
    {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-2.png);background-size:contain;"></div>',
      size: new navermaps.Size(40, 40),
      anchor: new navermaps.Point(20, 20),
    }, {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-3.png);background-size:contain;"></div>',
      size: new navermaps.Size(40, 40),
      anchor: new navermaps.Point(20, 20),
    }, {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-4.png);background-size:contain;"></div>',
      size: new navermaps.Size(40, 40),
      anchor: new navermaps.Point(20, 20),
    }, {
      content:
        '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-5.png);background-size:contain;"></div>',
      size: new navermaps.Size(40, 40),
      anchor: new navermaps.Point(20, 20),
    },
  ];

  const cluster = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 16,
    map: map,
    markers: markers.map((spot) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(spot.latitude, spot.longitude),
        draggable: false,
      });

      // 클릭 이벤트 추가
      naver.maps.Event.addListener(marker, 'click', () => {
        alert(`위도: ${spot.latitude}, 경도: ${spot.longitude}`);
      });

      return marker;
    }),
    disableClickZoom: false,
    gridSize: 120,
    icons: htmlMarkers,
    indexGenerator: [10, 100, 200, 500, 1000],
    stylingFunction: function (clusterMarker: any, count: number) {
      clusterMarker.getElement().querySelector('div:first-child').innerText = count;
    },
  });

}

export default function MyMap() {

  const navermaps = useNavermaps();
  const [latitude, setLatitude] = useState<number>(37.3595704);
  const [longitude, setLongitude] = useState<number>(127.105399);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(pos){
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
    });
  }, []);

  return (

    <MapDiv
      style={{
        width: '100%',
        height: window.innerHeight,
      }}
    >
      <NaverMap
        center={new navermaps.LatLng(latitude, longitude)}
        defaultZoom={15}
      >
        <MarkerCluster />
      </NaverMap>
    </MapDiv>
  )
}
