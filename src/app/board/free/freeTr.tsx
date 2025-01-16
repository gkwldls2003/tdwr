'use client'

import { useState, useEffect } from "react";
import { BoardFree } from "../../../../store/types/board";
import { useRouter } from "next/navigation";

export default function FreeBoardTr({ list }: { list: BoardFree[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);  // 처음에 로딩 상태를 true로 설정

  useEffect(() => {
    if (list.length > 0) {
      setIsLoading(false);  
    }
  }, [list]);

  function handleDetail(board_id: number) {
    sessionStorage.setItem('referrer', window.location.href);
    router.push(`/board/free/detail/${board_id}`);
  }

  if (isLoading) {
    return;
  }

  if (list.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="text-center">해당 데이터가 없습니다.</td>
      </tr>
    );
  }

  return (
    <>
      {list.map((obj, idx) => (
        <tr
          key={idx}
          className="cursor-pointer border-b bg-white-100"
          onClick={() => obj.board_id && handleDetail(obj.board_id)}
        >
          <td className="p-3 px-5 text-center">{obj.board_id}</td>
          <td className="p-3 px-5 text-left">{obj.title} <span className="text-red-500">[{obj.comment_cnt}]</span></td>
          <td className="p-3 px-5 text-center">{obj.user_nm}</td>
          <td className="p-3 px-5 text-center">{obj.crte_dttm}</td>
          <td className="p-3 px-5 text-center">{obj.view}</td>
          <td className="p-3 px-5 text-center text-red-500">{obj.rcd_good_cnt}</td>
        </tr>
      ))}
    </>
  );
}