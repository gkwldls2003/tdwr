import Colgroup from "@/app/components/board/colgroup"
import Table from "@/app/components/board/table"
import Th from "@/app/components/board/th"
import Header from "@/layout/header/page"
import { selectBoardFreeQuery } from "../../../../common/querys/board/page"
import FreeListButton from './freeListButton';
import Paging from "@/app/components/pagination/paging"
import FreeSearch from "./freeSearch"
import FreeBoardTr from "./freeTr"

export default async function Free( { searchParams } :
  {
    searchParams: {
      p?: number;
      s?: number;
      search_gb?: string;
      search?: string;
      se: string;
    }
  }
) {

  //검색
  let search = '';
  if(searchParams.search_gb && searchParams.search) {
    search = `&search_gb=${searchParams.search_gb}&search=${searchParams.search}`; 
  }

  //게시판 구분
  searchParams.se = 'free';
    
  const list = await selectBoardFreeQuery(searchParams);

  return (
    <>
      <div className="w-full min-w-[800px] max-w-[1200px] my-0 mx-auto">
        <h2 className="text-3xl font-bold text-center my-4">자유게시판</h2>
        <FreeListButton/>
        <Table>
          <Colgroup colgroup={['10%','*%','10%','15%','10%','7%']}/>
          <thead>
            <Th th={['번호','제목','작성자','등록일','조회수','추천수']}/>
          </thead>
          <tbody>
            <FreeBoardTr list={list.data}/>
          </tbody>
        </Table>
        <FreeSearch searchParams={searchParams}/>
        <Paging 
            router={`/board/free`} 
            tot={Number(list.data.length > 0 ? list.data[0].tot : 0)}
            pageNum={searchParams.p}
            search={search}
            />
        </div>
    </>
  )
}