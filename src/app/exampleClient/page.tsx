'use client'
import { useEffect, useState } from "react";
import { selectAllData, selectOneData, insertData, multiInsertData } from "../../../common/querys/exampleQuery/page"
export default function Test2() {

  interface WorkInfo {
    id: number
  }

  const [select, setSelect] = useState([]);
  const [selectOne, setSelectOne] = useState<WorkInfo>();

  const selectAll = async () => {
    const selectDataResult = await selectAllData();
    setSelect(selectDataResult.data);
  }

  const selectVo = async () => {
    const selectOneResult = await selectOneData();
    setSelectOne(selectOneResult);
    console.log(selectOne)
  }

  const insert = async () => {
    const result = await insertData();
  }
  
  useEffect(() => {
    selectAll();
    selectVo();
    //insert();
    //multiInsertData();

  }, [])
  return (
    <>
      <div>
        <h2>Select</h2>
        {
          select.map((vo: WorkInfo, i: number) => (
            <div key={i}>{vo.id}</div>
          ))
        }
      </div>
      <div>
        <h2>Vo</h2>
        {selectOne?.id}
      </div>
    </>
  )
}