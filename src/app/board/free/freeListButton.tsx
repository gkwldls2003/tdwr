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
    <>
      <button onClick={routToCreate} className="text-right">작성</button>
    </>
  )
}