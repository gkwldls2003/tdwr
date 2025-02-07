'use client'

import Header from "@/layout/header/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { insertBoardFreeQuery } from "../../../../common/querys/board/page";

const CkEditor = dynamic(() => import('@/app/components/editor/ckeditor.jsx'), {
  ssr: false,
});

export default function Create() {

  const router = useRouter();
  const { data: session } = useSession();
  const userInfo = session?.user.info;

  const [title, setTitle] = useState('');
  const [cn, setCn] = useState('');

  const handleCreate = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (confirm("저장 하시겠습니까?")) {
      e.preventDefault();
      const result = await insertBoardFreeQuery(['free', title, cn, userInfo?.user_id]);

      if (result.rows > 0) {
        alert("저장 되었습니다.");
        router.push(`/board/free/detail/${result.id}`);
        router.refresh();
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold text-center mb-6">자유게시판</h2>
        <Table>
          <Colgroup colgroup={['10%', '20%']} />
          <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 bg-gray-50 dark:text-white">제목</th>
              <td className="border border-slate-400">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  className="w-full p-3 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => { setTitle(e.target.value) }}
                />
              </td>
            </tr>
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 bg-gray-50 dark:text-white">내용</th>
              <td>
                <CkEditor data='' setData={setCn} se={'C'} />
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="flex justify-center mt-8 space-x-4">
          <Link
            href={typeof window !== 'undefined' ? (sessionStorage.getItem('referrer') || '/board/free') : '/board/free'}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-red-600 rounded-lg shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus:ring-2 focus:ring-red-500"
          >
            목록
          </Link>
          <a
            href="#"
            onClick={handleCreate}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-blue-500 rounded-lg shadow-md transition-all hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-500"
          >
            저장
          </a>
        </div>
      </div>
    </>
  );
}
