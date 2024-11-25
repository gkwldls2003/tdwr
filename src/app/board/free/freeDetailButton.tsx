'use client'

import Link from "next/link"
import { deleteBoardFreeQuery } from "../../../../common/querys/board/free/page"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BoardFree } from "../../../../store/types/boardFree";

export default function FreeDetailButton( { free_id, crte_user_id }: BoardFree) {

  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  const handleButton = () => {
    if (status === 'loading') {
      return null
    } else if (crte_user_id === userInfo?.user_id || userInfo?.author_id === 'ROLE_ADMIN') {
      return (
        <>
          <Link className="middle none center rounded-lg bg-blue-500 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" href={`/board/free/update/${free_id}`}>수정</Link>
          <a className="middle none center rounded-lg bg-red-600 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" href="#" onClick={handleDelete}>삭제</a>
        </>
      )
    }
  }

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

    if(confirm("삭제 하시겠습니까?")) {
      e.preventDefault();
      const result = await deleteBoardFreeQuery([free_id]);

      if(result.rows > 0) {
        alert("삭제 되었습니다.");
        router.push(`/board/free`);
        router.refresh();
      }
  
    }
    
  };

  return(
    <>
    <Link className="middle none center rounded-lg bg-blue-400 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" href={sessionStorage.getItem('referrer') || '/board/free'}>목록</Link>
    {handleButton()}
  </>
  )
}