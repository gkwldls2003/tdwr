'use client'

import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import axios from "axios";
import { useState, useEffect } from 'react';

interface Marker {
  latitude: number;
  longitude: number;
}

// instead of window.naver.maps

const markerArr: naver.maps.Marker[] = [];

export default function MyMap() {

  const navermaps = useNavermaps();
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    
    const fetchMarkers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_DB_JSON}/markers`);
        setMarkers(res.data);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };

    fetchMarkers();
    
  }, []);
  
  return (

    <MapDiv
      style={{
        width: '100%',
        height: '1000px',
      }}
    >
      <NaverMap
        defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
        defaultZoom={15}
      >
        {markers.map((marker: Marker, i: number) => (
          <Marker key={i} position={new navermaps.LatLng(marker.latitude, marker.longitude)} />
        ))}
      </NaverMap>
    </MapDiv>
  )
}
