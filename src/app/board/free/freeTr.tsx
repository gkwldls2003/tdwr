'use client'

import { useState, useEffect } from "react";
import { BoardFree } from "../../../../store/types/boardFree";
import { useRouter } from "next/navigation";

export default function FreeBoardTr({ list }: { list: BoardFree[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);  // 처음에 로딩 상태를 true로 설정

  useEffect(() => {
    if (list.length > 0) {
      setIsLoading(false);  
    }
  }, [list]);

  function handleDetail(free_id: number) {
    sessionStorage.setItem('referrer', window.location.href);
    router.push(`/board/free/detail/${free_id}`);
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
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          
        >
          <td
          onClick={() => obj.free_id && handleDetail(obj.free_id)}
          scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">{obj.title}</td>
          <td className="px-6 py-4">{obj.user_nm}</td>
          <td className="px-6 py-4">{obj.crte_dttm}</td>
          <td className="px-6 py-4 text-center">{obj.view}</td>
        </tr>
      ))}
    </>
  );
}