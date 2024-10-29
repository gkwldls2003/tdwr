'use client'

import axios from "axios";
import Script from "next/script"
import { useEffect, useState } from "react";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Overlay, useMap } from 'react-naver-maps'
import $ from "jquery";


const markerArr: naver.maps.Marker[] = [];

interface Marker {
  latitude: number;
  longitude: number;
}

async function getMarkers(): Promise<Marker[]> {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_DB_JSON}/markers`);
  const markers = res.data;
  return markers;
}

function setMarker(map: naver.maps.Map, latitude: number, longitude: number) {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(latitude, longitude),
    map: map
  });
  //마커 클러스트화 array
  markerArr.push(marker);
}

function getClusterIcon() {
  const htmlMarker1 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(https://navermaps.github.io/maps.js.ncp/docs/img/cluster-marker-1.png);background-size:contain;"></div>',
    size: new naver.maps.Size(40, 40),
    anchor: new naver.maps.Point(20, 20)
  },
    htmlMarker2 = {
      content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-2.png);background-size:contain;"></div>',
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker3 = {
      content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-3.png);background-size:contain;"></div>',
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker4 = {
      content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-4.png);background-size:contain;"></div>',
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker5 = {
      content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/example/images/cluster-marker-5.png);background-size:contain;"></div>',
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20)
    }

  return [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5]
}

export default function Map() {

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded) {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10
      };

      const map = new naver.maps.Map('map', mapOptions);

      const loadMarkers = async () => {

        //마커 조회
        const markers = await getMarkers();

        markers.map((marker: Marker) => {
          setMarker(map, marker.latitude, marker.longitude);
        });
      };

      loadMarkers();

      const markerClustering = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 13,
        map: map,
        markers: markerArr,
        disableClickZoom: false,
        gridSize: 120,
        icons: getClusterIcon(),
        indexGenerator: [10, 100, 200, 500, 1000],
        stylingFunction: function (clusterMarker: { getElement: () => any; }, count: any) {
          $(clusterMarker.getElement()).find('div:first-child').text(count);
        }
      });
    }
  }, [mapLoaded]);

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        onLoad={() => setMapLoaded(true)}
      ></Script>
      <div id="map" style={{ width: '100%', height: '2000px' }}></div>
    </>
  )
}