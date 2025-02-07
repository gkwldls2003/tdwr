"use client";

import {
  selectOneBoardQuery,
  updateBoardQuery,
} from "../../../../../common/querys/board/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import { useState, useEffect } from "react";
import { Board } from "../../../../../store/types/board";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import PulseLoaderSpinner from "@/app/components/spinner/PulseLoader";

const CkEditor = dynamic(() => import('@/app/components/editor/ckeditor.jsx'), {
  ssr: false,
});

export default function Detail({ params }: { params: { id: number } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  const [data, setData] = useState<Board>();
  const [cn, setCn] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  let render;

  useEffect(() => {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);


  async function fetchBoard() {
    const data = await selectOneBoardQuery([params.id]);
    setIsLoading(false);
    if (status === "loading") {
      return null;
    } else if (
      data?.crte_user_id === userInfo?.user_id ||
      userInfo?.author_id === "ROLE_ADMIN"
    ) {
      setData(data);
    } else {
      alert("권한이 없거나 잘못된 접근입니다.");
      router.push(`/board/free`);
      router.refresh();
    }
  }

  async function handleUpdate(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    if (confirm("수정 하시겠습니까?")) {
      const paramArr = [data?.title, cn, userInfo?.user_id, params.id];
      const result = await updateBoardQuery(paramArr);

      if (result.rows > 0) {
        alert("수정 되었습니다.");
        router.push(`/board/free/detail/${params.id}`);
        router.refresh();
      }
    }
  }

  if(isLoading) {
    render = <PulseLoaderSpinner/>
  } else {
    render = (
<div className="w-full min-w-[800px] max-w-[1200px] my-0 mx-auto">
        <h2 className="text-3xl font-bold text-center my-4">자유게시판</h2>
        <Table>
          <Colgroup colgroup={["10%", "20%", "10%", "10%", "10%", "10%"]} />
          <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">
                제목
              </th>
              <td className="border border-slate-400 p-0">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={data?.title}
                  className="w-full p-3 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setData(prevData => ({
                    ...prevData,
                    title: e.target.value,
                  }))}
                />
              </td>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">
                작성자
              </th>
              <td className="border border-slate-400 text-center px-3 py-2">
                {data?.user_nm}
              </td>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">
                조회수
              </th>
              <td className="border border-slate-400 text-center px-3 py-2">{data?.view}</td>
            </tr>
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">
                내용
              </th>
              <td colSpan={5} className="border border-slate-400 p-0">
                <CkEditor data={data && data.cn} setData={setCn} se={'U'} />
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="flex justify-center mt-4">
          <a
            className="middle none center rounded-lg bg-blue-500 py-3 px-8 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            href="#"
            onClick={handleUpdate}
          >
            저장
          </a>
          <Link
            className="middle none center rounded-lg bg-red-600 py-3 px-8 font-sans text-sm font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            href={`/board/free/detail/${params.id}`}
          >
            취소
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {render}
    </>
  );
}
