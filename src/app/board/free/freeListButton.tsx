'use client'

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function FreeListButton() {

  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  function routToCreate() {
    if(status === 'loading') {
      return;
    } else if (userInfo) {
      sessionStorage.setItem('referrer', window.location.href);
      router.push(`/board/free/create`);
    } else {
      router.push(`/login`);
    }
  }

  return(
    <div className="flex justify-end mb-2">
      <button onClick={routToCreate} 
      className="middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
        작성하기
      </button>
    </div>
  )
}