'use client'

import { insertBoardViewQuery, selectOneBoardQuery } from "../../../../../common/querys/board/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import FreeDetailButton from "../../freeDetailButton";
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation'
import Recommand from "@/app/components/board/recommand";
import CommentWrapper from "@/app/components/board/CommentWrapper";
import { useEffect, useState } from "react";
import { Board } from "@/store/types/board";
import PulseLoaderSpinner from "@/app/components/spinner/PulseLoader";

export default function Detail({ params } : { params: {id: number} }) {

  const [board, setBoard] = useState<Board | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  let render;
  const fetchBoard = async () => {
    const vo = await selectOneBoardQuery([params.id]);

    if(vo.length === 0) {
      //게시판 내용이 없으면
      router.push('/not-found');
      return;
    }
    
    //조회수 증가
    await insertBoardViewQuery([params.id]);

    setBoard(vo);
    setIsLoading(false);

  }

  if(!isLoading && board) {
    render = (
      <div className="w-full min-w-[800px] max-w-[1200px] my-0 mx-auto">
        <h2 className="text-3xl font-bold text-center my-4">자유게시판</h2>
        <div className="flex justify-end mt-4">
          <FreeDetailButton board_id={params.id} crte_user_id={board.crte_user_id} />
        </div>
        <Table>
          <Colgroup colgroup={['15%', '35%', '15%', '15%', '10%', '10%']} />
          <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">제목</th>
              <td className="px-6 py-4">{board.title}</td>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">작성자</th>
              <td className="px-6 py-4 text-center">{board.user_nm}</td>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">조회수</th>
              <td className="px-6 py-4 text-center">{board.view}</td>
            </tr>
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">작성일</th>
              <td colSpan={5} className="px-6 py-4">{board.crte_dttm}</td>
            </tr>
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">내용</th>
              <td colSpan={5} className="px-6 py-4 min-h-[200px] whitespace-pre-wrap">
              {typeof board.cn === 'string' && parse(board.cn)}
              </td>
            </tr>
          </tbody>
        </Table>
        {/* 추천 비추천 버튼 */}
        <Recommand mapng_key={params.id} se={'free'}/>
        {/* 댓글 */}
        <CommentWrapper board_id={params.id} se={'free_comment'}/>
      </div>
    )
  } else if(isLoading) {
    render = <PulseLoaderSpinner />;
  } 
  
  useEffect(()=> {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {render}
    </>
  )
}