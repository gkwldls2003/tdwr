import { Marker, useNavermaps, useMap } from 'react-naver-maps'
import axios from "axios";
import { useState, useEffect } from 'react';
import { makeMarkerClustering } from '../../../common/utils/navermap/marker-cluster'


interface Marker {
  id: number;
  latitude: number;
  longitude: number;
}

export default function MarkerCluster():any {

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

  const cluster:any = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 16,
    map: map,
    markers: markers.map((spot) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(spot.latitude, spot.longitude),
        draggable: false,
        id: spot.id
      });

      // 클릭 이벤트 추가
      naver.maps.Event.addListener(marker, 'click', () => {
        getMarkerList(spot.latitude, spot.longitude);
      });

      return marker;
    }),
    disableClickZoom: false,
    gridSize: 120,
    icons: htmlMarkers,
    indexGenerator: [10, 100, 200, 500, 1000],
    stylingFunction: function (clusterMarker: any, count: number) {
      clusterMarker.getElement().querySelector('div:first-child').innerText = count;
      naver.maps.Event.addListener(clusterMarker, 'click', (e) => {
        getMarkerList(e.coord._lat, e.coord._lng);
      });
    },
  });

  //클러스터에 포함한 marker 가져오기
  function getMarkerList(latitude: number, longitude: number) {
    const markerList = cluster._getClosestCluster(new naver.maps.LatLng(latitude, longitude));
    console.log(markerList._clusterMember);
  }
  
  //현재 위치로 이동하는 버튼, evnet
  naver.maps.Event.once(map, 'init', function () {

    const locationBtnHtml = `
    <button
    style="
        z-index: 100;
        overflow: hidden;
        display: inline-block;
        position: absolute;
        top: -30px;
        left: 9px;
        width: 31px;
        height: 30px;
        border: 1px solid rgba(58,70,88,.45);
        border-radius: 2px;
        background: #fcfcfd;
          background-clip: border-box;
        text-align: center;
        -webkit-background-clip: padding;
        background-clip: padding-box;
      "
    >
      <span style="
        overflow: hidden;
        display: inline-block;
        color: transparent !important;
        vertical-align: top;
        background: url(https://ssl.pstatic.net/static/maps/m/spr_trff_v6.png) 0 0;
        -webkit-background-size: 200px 190px;
        width: 20px;
        height: 20px;
        margin: 3px 0 0 0;
        background-position: -153px -29px;
      ">NAVER 그린팩토리</span>
      </button>
  `
    const customControl = new navermaps.CustomControl(locationBtnHtml, {
      position: navermaps.Position.RIGHT_CENTER,
    })

    customControl.setMap(map);
    const domElement = customControl.getElement()
    domElement.addEventListener('click', domListener)

    function domListener() {
      navigator.geolocation.getCurrentPosition(function (pos) {
        map?.setCenter(new navermaps.LatLng(pos.coords.latitude, pos.coords.longitude))
      }
        , function (err) {
          alert("위치 접근을 허용해 주시길 바랍니다.")
        }
      )
    }

  });

}