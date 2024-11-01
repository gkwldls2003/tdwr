'use client'
import { useEffect, useState } from "react";
import { selectAllData, selectOneData, insertData } from "../../../common/exampleQuery/page"
export default function Test2() {

  interface Board {
    uid: number
  }

  const [select, setSelect] = useState([]);
  const [selectOne, setSelectOne] = useState<Board>();

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

  }, [])
  return (
    <>
      <div>
        <h2>Select</h2>
        {
          select.map((vo: Board, i: number) => (
            <div key={i}>{vo.uid}</div>
          ))
        }
      </div>
      <div>
        <h2>Vo</h2>
        {selectOne?.uid}
      </div>
    </>
  )
}