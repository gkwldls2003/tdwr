'use client'

import { useRouter } from "next/navigation";

export default function  Error() {

  const router = useRouter();

  function handleGoHome() {
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <h2>권한이 없거나 잘못된 페이지입니다.</h2>
      <button onClick={handleGoHome}>메인페이지로 가기</button>
    </>
  )
}