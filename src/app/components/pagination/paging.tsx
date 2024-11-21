'use client'

import { useRouter } from "next/navigation";
import Pagination from "react-js-pagination";

interface Props {
  router: string; //이동 url
  pageSize?: number; //한 페이징 당 보일 리스트 수 default 10
  pageNum?: number; //현재 페이지
  tot: number; // 리스트 총 갯수
  search?: any; //검색
}

export default function Paging( props  : Props) {

  const router = useRouter();

  const handlePageChange = (e: number) => {
    router.push(`${props.router}?p=` + e + `&s=` + (props.pageSize ? props.pageSize : 10)
              + `${props.search}`
  );
}
  return (
    <div className="paging_wrap">
      <Pagination
          //현재 보고있는 페이지
          activePage={props?.pageNum ? Number(props.pageNum) : 1}
          //페이지당 항목 수
          itemsCountPerPage={props.pageSize}
          //전체 총 리스트 수
          totalItemsCount={props.tot}
          //표시할 페이지수
          pageRangeDisplayed={10}
          //<ul> 태그 의 클래스 이름
          innerClass={"paging"}
          //이전 페이지 탐색 버튼의 텍스트
          prevPageText={"<"}
          //다음 페이지 탐색 버튼의 텍스트
          nextPageText={">"}
          //탐색 버튼 숨기기(이전 페이지, 다음 페이지)
          /*hideNavigation={true}
          //첫 번째/마지막 탐색 버튼 숨기기
          hideFirstLastPages={true}*/
          onChange={handlePageChange}>
      </Pagination>
    </div>
  )
}