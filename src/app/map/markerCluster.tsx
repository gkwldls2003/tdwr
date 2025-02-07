import { useNavermaps, useMap } from 'react-naver-maps'
import { useState, useEffect } from 'react';
import { makeMarkerClustering } from '../../common/utils/navermap/marker-cluster'
import { selectMapInfoQuery } from '../../common/querys/map/page';
import { useAppDispatch } from '../../store/hooks';
import { setAllMarkers, setError, setLoading, setVisibleMarkers } from '../../store/markerSlice';
import { Markers } from '../../store/types/marker';


export default function MarkerCluster(): any {
  const navermaps = useNavermaps()
  const map = useMap()
  const MarkerClustering = makeMarkerClustering(window.naver)
  const [markers, setMarkers] = useState<Markers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLvl, setZoomLvl] = useState(map?.getZoom());
  const dispatch = useAppDispatch();

  const fetchMarkers = async () => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      const selectMapInfo = await selectMapInfoQuery();
      const markerData = selectMapInfo.data;
      setMarkers(markerData);
      dispatch(setAllMarkers(markerData));
    } catch (error) {
      console.error("마커를 가져오는 중 오류 발생:", error);
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchMarkers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //줌 인 아웃 시 zoomLvl 가져옴
  useEffect(() => {
    if (map) {
        naver.maps.Event.addListener(map, 'zoom_changed', () => {
        const currentZoom = map.getZoom();

        setZoomLvl(currentZoom);
        
      });
      
    }
  }, [map]);

  //주위에 있는 marker 불러오기
  useEffect(() => {
    if (!isLoading && markers.length > 0 && map) {

      getvisibleMarkerList();

      //드래그 시 마커 확인
      const dragEndListener = naver.maps.Event.addListener(map, 'dragend', (e) => {
        getvisibleMarkerList();
      });

      //줌인, 줌아웃 시 마커 확인
      const zoomChangedListener = naver.maps.Event.addListener(map, 'zoom_changed', () => {
        getvisibleMarkerList();
      });

      return () => {
        naver.maps.Event.removeListener(dragEndListener);
        naver.maps.Event.removeListener(zoomChangedListener);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, markers, map]);

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

  const cluster: any = new MarkerClustering({
    minClusterSize: 2,
    maxZoom: 16,
    map: map,
    markers: markers.map((spot) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(spot.latitude, spot.longitude),
        draggable: false,
      
      });

      marker.set('markerInfo',{
        id: spot.id,
        latitude: spot.latitude,
        longitude: spot.longitude,
        name: spot.name,
        price: spot.price,
        description: spot.description,
      })

      // 클릭 이벤트 추가
      naver.maps.Event.addListener(marker, 'click', () => {
        getMarkerList(spot.latitude, spot.longitude);
      });

      return marker;
    }),
    //줌이 15이상이면 zoonChange 안함
    disableClickZoom: zoomLvl && zoomLvl >= 15 ? true : false,
    gridSize: 120,
    icons: htmlMarkers,
    indexGenerator: [10, 100, 200, 500, 1000],
    stylingFunction: function (clusterMarker: any, count: number) {
      clusterMarker.getElement().querySelector('div:first-child').innerText = count;
      naver.maps.Event.addListener(clusterMarker, 'click', (e) => {
        if(zoomLvl && zoomLvl >= 15) {
          getMarkerList(e.coord._lat, e.coord._lng);
        }
      });
    },
  });

  //클러스터에 포함한 marker 가져오기
  function getMarkerList(latitude: number, longitude: number) {
    const markerList = cluster._getClosestCluster(new naver.maps.LatLng(latitude, longitude));

    const markerInfoArr:Markers[] = [];
    markerList._clusterMember.map((marker:any) => {
        markerInfoArr.push(marker.markerInfo)
    })
    // 클릭한 마커 정보를 Redux store에 저장
    dispatch(setVisibleMarkers(markerInfoArr));
  }

  //현재 위치에서 보이는 marker 가져오기
  function getvisibleMarkerList() {
    const map = cluster.getMap();
    const bounds = map.getBounds(); // 현재 맵의 경계 가져오기

    if (!bounds) return; // 경계가 정의되지 않은 경우 함수 종료

    const visibleMarkers = markers.filter(spot => {
      const markerPosition = new naver.maps.LatLng(spot.latitude, spot.longitude);
      return bounds.hasLatLng(markerPosition);
    }).map(marker => ({
      id: marker.id,
      name: marker.name,
      price: marker.price,
      latitude: marker.latitude,
      longitude: marker.longitude,
      description: marker.description
    }));

    // 전체 마커 정보를 Redux store에 저장
    dispatch(setVisibleMarkers(visibleMarkers));
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