import Header from "@/layout/header/page";
import { insertBoardFreeViewQuery, selectOneBoardFreeQuery } from "../../../../../../common/querys/board/free/page";
import Colgroup from "@/app/components/board/colgroup";
import Table from "@/app/components/board/table";
import FreeDetailButton from "../../freeDetailButton";

export default async function Detail({ params } : { params: {id: number} }) {

  //조회수 증가
  await insertBoardFreeViewQuery([params.id]);

  const vo = await selectOneBoardFreeQuery([params.id]);

  return (
    <>
      <Header/>
      <Table>
        <Colgroup colgroup={['10%', '20%','10%','10%','10%','10%']}/>
        <tbody>
          <tr>
            <th className="border border-slate-400">제목</th>
            <td className="border border-slate-400">{vo.title}</td>
            <th className="border border-slate-400">작성자</th>
            <td className="border border-slate-400 text-center">{vo.user_nm}</td>
            <th className="border border-slate-400">조회수</th>
            <td className="border border-slate-400 text-center">{vo.view}</td>
          </tr>
          <tr>
            <th className="border border-slate-400">내용</th>
            <td colSpan={5} className="border border-slate-400 whitespace-pre-wrap">{vo.cn}</td>
          </tr>
        </tbody>
      </Table>
      <div>
          <FreeDetailButton free_id={params.id} crte_user_id={vo.crte_user_id}/>
      </div>
    </>
  )
}