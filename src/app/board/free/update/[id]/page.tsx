'use client'

import Header from "@/layout/header/page";
import { selectOneBoardFreeQuery, updateBoardFreeQuery } from "../../../../../../common/querys/board/free/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import { useState, useEffect } from "react";
import { BoardFree } from "../../../../../../store/types/boardFree";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Detail({ params } : { params: {id: number} }) {

  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  useEffect(() => {
    getFreeBoard();
  }, [status]);

  const [vo, setVo] = useState<BoardFree | undefined>({
    title: "",
    cn: "",
  });

  async function getFreeBoard () {
    const data = await selectOneBoardFreeQuery([params.id]);
    if (status === 'loading') {
      return null
    } else if (data.crte_user_id === userInfo?.user_id || userInfo?.author_id === 'ROLE_ADMIN') {
      setVo(data);
    } else {
      alert("권한이 없거나 잘못된 접근입니다.");
      router.push(`/board/free`);
      router.refresh();
    }
    
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { value, name } = e.target;
    setVo({
      ...vo,
      [name]: value,
    });
  }

  async function handleUpdate(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    if(confirm("수정 하시겠습니까?")) {
      const paramArr = [vo?.title, vo?.cn, userInfo?.user_id, params.id];
      const result = await updateBoardFreeQuery(paramArr);
  
      if(result.rows > 0) {
        alert("수정 되었습니다.");
        router.push(`/board/free/detail/${params.id}`);
        router.refresh();
      }
    }
    
  }

  return (
    <>
      <Header/>
      <Table>
        <Colgroup colgroup={['10%', '20%','10%','10%','10%','10%']}/>
        <tbody>
          <tr>
            <th className="border border-slate-400">제목</th>
            <td className="border border-slate-400">
              <input type="text" id="title" name="title" value={vo?.title} className="size-full" onChange={onChange}/>
            </td>
            <th className="border border-slate-400">작성자</th>
            <td className="border border-slate-400 text-center">{vo?.user_nm}</td>
            <th className="border border-slate-400">조회수</th>
            <td className="border border-slate-400 text-center">{vo?.view}</td>
          </tr>
          <tr>
            <th className="border border-slate-400">내용</th>
            <td colSpan={5} className="border border-slate-400">
              <textarea rows={10} id="cn"  name="cn" value={vo?.cn} className="size-full" onChange={onChange}/>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
          <a href="#" onClick={handleUpdate}>저장</a>
          <Link href={`/board/free/detail/${params.id}`}>취소</Link>
      </div>
    </>
  )
}