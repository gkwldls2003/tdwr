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
          className="cursor-pointer border-b bg-white-100"
          onClick={() => obj.free_id && handleDetail(obj.free_id)}
        >
          <td className="p-3 px-5 text-left">{obj.title}</td>
          <td className="p-3 px-5 text-center">{obj.user_nm}</td>
          <td className="p-3 px-5 text-center">{obj.crte_dttm}</td>
          <td className="p-3 px-5 text-center">{obj.view}</td>
        </tr>
      ))}
    </>
  );
}