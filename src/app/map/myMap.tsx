'use client'

import { Container as MapDiv, NaverMap, useNavermaps } from 'react-naver-maps'
import { useState, useEffect } from 'react';
import MarkerCluster from './markerCluster';

export default function MyMap() {

  const navermaps = useNavermaps();
  const [latitude, setLatitude] = useState<number>(37.3595704);
  const [longitude, setLongitude] = useState<number>(127.105399);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (pos) {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
    });
  }, []);

  return (

    <MapDiv
    style={{
      width: '100%',
      height: '100%',
    }}
    >
      <NaverMap
        center={new navermaps.LatLng(latitude, longitude)}
        defaultZoom={15}
        zoomControl={true}
        zoomControlOptions={{
          position: navermaps.Position.RIGHT_CENTER
        }}
      >
        <MarkerCluster />
      </NaverMap>
    </MapDiv>
  )
}
