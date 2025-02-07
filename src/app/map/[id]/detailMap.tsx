import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, useNavermaps, Marker } from 'react-naver-maps';
import { Markers } from '../../../store/types/marker';

export default function DetailMap( { marker } : { marker: Markers } ) {
  const navermaps = useNavermaps();
  const [mapCenter, setMapCenter] = useState({
    latitude: marker?.latitude || 37.3595704,
    longitude: marker?.longitude || 127.105399
  });

  useEffect(() => {
    if (marker?.latitude && marker?.longitude) {
      setMapCenter({
        latitude: marker.latitude,
        longitude: marker.longitude
      });
    }
  }, [marker]);

  return (
    <MapDiv className="w-full h-full">
      <NaverMap
        center={new navermaps.LatLng(mapCenter.latitude, mapCenter.longitude)}
        defaultZoom={15}
        zoomControl={true}
        zoomControlOptions={{
          position: navermaps.Position.RIGHT_CENTER
        }}
      >
        {marker && (
          <Marker
            position={new navermaps.LatLng(marker.latitude, marker.longitude)}
            animation={navermaps.Animation.DROP}
          />
        )}
      </NaverMap>
    </MapDiv>
  );
}