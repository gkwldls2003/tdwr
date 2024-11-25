'use client'

import Link from "next/link"
import { deleteBoardFreeQuery } from "../../../../common/querys/board/free/page"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BoardFree } from "../../../../store/types/boardFree"
import { useState } from 'react'

export default function FreeDetailButton({ free_id, crte_user_id }: BoardFree) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const userInfo = session?.user.info
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

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
            onClick={() => setIsModalOpen(true)}
          >
            삭제
          </button>
        </>
      )
    }
  }

  const handleDelete = async () => {
    const result = await deleteBoardFreeQuery([free_id])

    if (result.rows > 0) {
      setIsModalOpen(false)
      setShowSuccessMessage(true)
      
      // 2초 후 목록으로 이동
      setTimeout(() => {
        router.push(`/board/free`)
        router.refresh()
      }, 1500)
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

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => setIsModalOpen(false)}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">삭제 하시겠습니까?</h3>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                  onClick={handleDelete}
                >
                  예
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                  onClick={() => setIsModalOpen(false)}
                >
                  아니오
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow">
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-green-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">삭제되었습니다.</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}