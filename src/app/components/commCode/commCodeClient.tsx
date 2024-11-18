import { useQuery } from '@tanstack/react-query';
import { selectCommCodeQuery } from '../../../../common/querys/auth/page';
import { Fragment } from 'react';

//이벤트 핸들러가 필요하거나 useClient 사용할때

interface CommCode {
  code_id: string; //코드 id
  name: string; // 요소 name
  type: string; // type : select, checkbox, radio 중 선택
  code_detail?: string; //상세 코드
  code_nm?: string; //상세 코드 이름
  id?: string; // 요소 id
  value?: string; // value 값
  showSelect?: boolean; //select option 선택 추가
  showAll?: boolean; //select option 전체 추가
  defaultCode?: string; //최초에 선택되는 기본 코드 값
  className?: string; // className 설정
  onChange?: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void; // onChange 함수
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;// onClick 함수
}

export default function CommCode(props: CommCode) {
  const { data } = useQuery({
    queryKey: ['code', props.code_id],
    queryFn: () => selectCommCodeQuery([props.code_id]),
    staleTime: 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  let element;
  let value:string = '';
  
  if (data) {
    if (props.type === 'select') {
      if (props.value) {
        value = props.value;
      } else if (props.defaultCode) {
        value = props.defaultCode;
      }

      let obj = {};
      if(props.onChange) {
        obj = {
          value: props.value,
          onChange: props.onChange
        }
      } else {
        obj = {
          defaultValue: value
        }
      }

      element = (
        <select
          {...obj}
          className={props.className}
        >
          {props.showSelect && <option key='select' value=''>선택</option>}
          {props.showAll && <option key='all' value=''>전체</option>}
          {data.data.map((code: CommCode) => (
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
        data.data.map((code: CommCode) => (
          <Fragment key={`${props.code_id}-${code.code_detail}`}>
            <input 
              type='checkbox'
              key={code.code_detail}
              name={props.name}
              value={code.code_detail}
              onClick={props.onClick}
              />
              <label htmlFor={code.code_detail}>{code.code_nm}</label>          
          </Fragment>
        ))
      )
    } else if (props.type == 'radio') {

      if (props.value) {
        value = props.value;
      } else if (props.defaultCode) {
        value = props.defaultCode;
      }
      
      element = (
        data.data.map((code: CommCode) => (
          <Fragment key={`${props.code_id}-${code.code_detail}`}>
            <input 
              type='radio'
              key={code.code_detail}
              name={props.name}
              id={props.code_id + code.code_detail}
              value={code.code_detail}
              onClick={props.onClick}
              defaultChecked={code.code_detail === value}
              />
              <label htmlFor={code.code_detail}>{code.code_nm}</label>          
          </Fragment>
        ))
      )
    }
  }
  return element;
}