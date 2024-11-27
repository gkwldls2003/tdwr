'use client'

import Header from "@/layout/header/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardFree } from "../../../../../store/types/boardFree";
import dynamic from "next/dynamic";
import { insertBoardFreeQuery } from "../../../../../common/querys/board/free/page";

const CkEditor = dynamic(() => import('@/app/components/editor/ckeditor.jsx'), {
  ssr: false,
});

export default function Create() {

  const router = useRouter();
  const { data: session } = useSession();
  const userInfo = session?.user.info;

  const [title, setTitle] = useState('')
  const [cn, setCn] = useState('')

  const handleCreate = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

    if (confirm("저장 하시겠습니까?")) {
      e.preventDefault();
      const result = await insertBoardFreeQuery([title, cn, userInfo?.user_id]);

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
      <Table>
        <Colgroup colgroup={['10%', '20%']} />
        <tbody>
          <tr>
            <th className="border border-slate-400">제목</th>
            <td className="border border-slate-400">
              <input type="text" id="title" name="title" value={title} className="size-full" onChange={(e) => {setTitle(e.target.value)}} />
            </td>
          </tr>
          <tr>
            <th className="border border-slate-400">내용</th>
            <td>
              <CkEditor data='' setData={setCn} se={'C'}/>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Link href={typeof window !== 'undefined' ? (sessionStorage.getItem('referrer') || '/board/free') : '/board/free'}>목록</Link>
        <a href="#" onClick={handleCreate}>저장</a>
      </div>
    </>
  )
}