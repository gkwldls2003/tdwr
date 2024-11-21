'use client'

import Header from "@/layout/header/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardFree } from "../../../../../store/types/boardFree";
import { insertBoardFreeQuery } from "../../../../../common/querys/board/free/page";

export default function Create() {

  const router = useRouter();
  const { data: session } = useSession();
  const userInfo = session?.user.info;

  const [input, setInput] = useState<BoardFree>({
    title: "",
    cn: "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { value, name } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  }

  const handleCreate = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {

    if(confirm("저장 하시겠습니까?")) {
      e.preventDefault();
      const result = await insertBoardFreeQuery([input.title, input.cn, userInfo?.user_id]);

      if(result.rows > 0) {
        alert("저장 되었습니다.");
        router.push(`/board/free/detail/${result.id}`);
        router.refresh();
      }
  
    }
    
  };

  return (
    <>
      <Header/>
      <Table>
        <Colgroup colgroup={['10%', '20%']}/>
        <tbody>
          <tr>
            <th className="border border-slate-400">제목</th>
            <td className="border border-slate-400">
              <input type="text" id="title" name="title" value={input.title} className="size-full" onChange={onChange}/>
            </td>
          </tr>
          <tr>
            <th className="border border-slate-400">내용</th>
            <td className="border border-slate-400">
              <textarea rows={10} id="cn"  name="cn" value={input.cn} className="size-full" onChange={onChange}/>
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