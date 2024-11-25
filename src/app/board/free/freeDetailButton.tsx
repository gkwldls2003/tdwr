'use client'

import Link from "next/link"
import { deleteBoardFreeQuery } from "../../../../common/querys/board/free/page"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BoardFree } from "../../../../store/types/boardFree"
import { useState } from 'react'
import ConfirmationModal from "../../../../common/utils/cmm/modal/ConfirmationModal"

export default function FreeDetailButton({ free_id, crte_user_id }: BoardFree) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userInfo = session?.user.info
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false)

  const handleButton = () => {
    if (status === 'loading') {
      return null
    } else if (crte_user_id === userInfo?.user_id || userInfo?.author_id === 'ROLE_ADMIN') {
      return (
        <>
          <Link 
            className="middle none center rounded-lg bg-blue-500 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" 
            href={`/board/free/update/${free_id}`}
          >
            수정
          </Link>
          <button
            className="middle none center rounded-lg bg-red-600 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            삭제
          </button>
        </>
      )
    }
  }

  const handleDelete = async () => {
    const result = await deleteBoardFreeQuery([userInfo?.user_id, free_id])

    if (result.rows > 0) {
      setIsDeleteModalOpen(false)
      setIsSuccessModalOpen(true)
      
      setTimeout(() => {
        router.push(`/board/free`)
        router.refresh()
      }, 2000)
    }
  }

  return (
    <>
    <Link 
      className="middle none center rounded-lg bg-blue-400 py-2 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" 
      href={sessionStorage.getItem('referrer') || '/board/free'}
    >
      목록
    </Link>
    {handleButton()}

    {/* 삭제 확인 모달 */}
    <ConfirmationModal
      isOpen={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      onConfirm={handleDelete}
      title="삭제 하시겠습니까?"
      buttonText="삭제"
      iconType="warning"
    />

    {/* 삭제 완료 모달 */}
    <ConfirmationModal
      isOpen={isSuccessModalOpen}
      onClose={() => setIsSuccessModalOpen(false)}
      onConfirm={() => setIsSuccessModalOpen(false)}
      title="삭제되었습니다."
      buttonText="확인"
      iconType="success"
    />
  </>
  )
}