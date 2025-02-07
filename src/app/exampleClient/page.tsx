import { selectAllData, selectOneData, insertData, multiInsertData } from "../../common/querys/exampleQuery/page"
import CommCodeServer from "../components/commCode/commCodeServer";
import FileDownLoad from "../components/file/fileDownload";
import FileUploadExample from "./fileUploadExample";
export default async function Test2() {

  interface WorkInfo {
    id: number
  }

  const selectDataResult = await selectAllData();
  const selectOneResult = await selectOneData();
  //const result = await insertData();
  //const multiResult = await multiInsertData();
  
  return (
    <>
    <div>
      <CommCodeServer code_id='TD_001' type='select' name='login_method' showAll={true}/>
    </div>
    <div>
      <CommCodeServer code_id='TD_001' type='checkbox' name='login_method' defaultCode="01"/>
    </div>
    <div>
      <CommCodeServer code_id='TD_001' type='radio' name='login_method' defaultCode="02"/>
    </div>
      <div>
        <h2>Select</h2>
        {
          selectDataResult.data.map((vo: WorkInfo, i: number) => (
            <div key={i}>{vo.id}</div>
          ))
        }
      </div>
      <div>
        <h2>Vo</h2>
        {selectOneResult?.id}
      </div>
      <FileUploadExample/>
      <FileDownLoad id={1} table={"tb_example"} colunm_nm={"example"}/>
    </>
  )
}