import { selectCommCodeQuery } from '../../../../common/querys/auth/page';
import { Fragment } from 'react';
import { cache } from 'react'

//SSR 로 랜더링할 때

interface CommCode {
  code_id: string; //코드 id
  name: string; // 요소 name
  type: string; // type : select, checkbox, radio 중 선택
  code_detail?: string; //상세 코드
  code_nm?: string; //상세 코드 이름
  id?: string; // 요소 id
  showSelect?: boolean; //select option 선택 추가
  showAll?: boolean; //select option 전체 추가
  defaultCode?: string; //최초에 선택되는 기본 코드 값
  className?: string; // className 설정
}

const getCodeList = cache(async (code_id: string) => {
  const result = await selectCommCodeQuery([code_id])
  return result.data;
})

export default async function CommCodeServer(props: CommCode) {

  const codeList = await getCodeList(props.code_id);

  let element;
  
  if (codeList) {
    if (props.type === 'select') {
      
      element = (
        <select
          defaultValue={props.defaultCode}
          className={props.className}
          name={props.name}
          id={props.id}
        >
          {props.showSelect && <option key='select' value=''>선택</option>}
          {props.showAll && <option key='all' value=''>전체</option>}
          {codeList.map((code: CommCode) => (
            <option 
              key={code.code_detail} 
              value={code.code_detail}
              >
              {code.code_nm}
            </option>
          ))}
        </select>
      );
    } else if (props.type === 'checkbox') {
      element = (
        codeList.map((code: CommCode) => (
          <Fragment key={`${props.code_id}-${code.code_detail}`}>
            <input 
              type='checkbox'
              key={code.code_detail}
              name={props.name}
              defaultValue={code.code_detail}
              defaultChecked={code.code_detail === props.defaultCode}
              />
              <label htmlFor={code.code_detail}>{code.code_nm}</label>          
          </Fragment>
        ))
      )
    } else if (props.type == 'radio') {

      element = (
        codeList.map((code: CommCode) => (
          <Fragment key={`${props.code_id}-${code.code_detail}`}>
            <input 
              type='radio'
              key={code.code_detail}
              name={props.name}
              id={props.code_id + code.code_detail}
              value={code.code_detail}
              defaultChecked={code.code_detail === props.defaultCode}
              />
              <label htmlFor={code.code_detail}>{code.code_nm}</label>          
          </Fragment>
        ))
      )
    }
  }
  return element;
}