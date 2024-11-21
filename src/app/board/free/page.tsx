'use client'

import Colgroup from "@/app/components/board/colgroup"
import Table from "@/app/components/board/table"
import Th from "@/app/components/board/th"
import Header from "@/layout/header/page"
import { selectBoardFreeQuery } from "../../../../common/querys/board/free/page"
import FreeListButton from './freeListButton';
import Paging from "@/app/components/pagination/paging"
import FreeSearch from "./freeSearch"
import { useEffect, useState } from "react"
import { BoardFree } from "../../../../store/types/boardFree"
import FreeBoardTr from "./freeTr"

export default function Free( { searchParams } :
  {
    searchParams: {
      p?: number;
      s?: number;
      search_gb?: string;
      search?: string;
    }
  }
) {

  const [ list, setList ] = useState<BoardFree[]>([]);
  //검색
  let search = '';
  if(searchParams.search_gb && searchParams.search) {
    search = `&search_gb=${searchParams.search_gb}&search=${searchParams.search}`; 
  }

  const boardFreeList = async () => {
    
    const result = await selectBoardFreeQuery(await searchParams);
    setList(result.data)
  };

  useEffect(() => {
    boardFreeList();
  }, [searchParams]);

  return (
    <>
      <Header/>
        <h2>자유게시판</h2>
        <FreeListButton/>
        <FreeSearch searchParams={searchParams}/>
        <Table>
          <Colgroup colgroup={['*%','10%','15%','10%']}/>
          <thead>
            <Th th={['제목','작성자','등록일','조회수']}/>
          </thead>
          <tbody>
            <FreeBoardTr list={list}/>
          </tbody>
        </Table>
        <Paging 
            router={`/board/free`} 
            tot={Number(list.length > 0 ? list[0].tot : 0)}
            pageNum={searchParams.p}
            search={search}
             />
    </>
  )
}