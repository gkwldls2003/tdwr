'use client'

import { useEffect, useState } from "react";
import { selectOneFileMapngDataQuery } from "../../../common/querys/cmm/page";

interface Props {
  id: number | string;
  table: string;
  colunm_nm: string;
  sn?: number | string;
}

interface FileMapng {
  stre_file_nm: string;
  orignl_file_nm: string;
}

const handleDownload = async (e: React.MouseEvent, stre_file_nm:string) => {

  e.preventDefault();
  const response = await fetch(`/api/file/download/${stre_file_nm}`);
  
  if (!response.ok) {
    const json = await response.json();
    alert(json.message);
    return;
  }

  const contentDisposition = response.headers.get('content-disposition');
    const realFileName = contentDisposition
      ? decodeURIComponent(contentDisposition.split('filename=')[1].replace(/['"]/g, ''))
      : '';

    // Blob 생성
    const blob = await response.blob();
    
    // 다운로드 링크 생성 및 클릭
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = realFileName;
    document.body.appendChild(link);
    link.click();
    
    // 정리
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

  
};

export default function FileDownLoad( props : Props) {

  const sn = props.sn ? props.sn : 1
  const parmas = [props.id, props.table, props.colunm_nm, sn]
  const [ result, setResult ] = useState<FileMapng>();

  const getFileData = async () => {
    setResult(await selectOneFileMapngDataQuery(parmas));
  }
  useEffect(() => {
    getFileData();
  }, [])

  const downLoadButton = () => {
    if(result) {
      return (
          <a href="#" onClick={(e) => {handleDownload(e,result.stre_file_nm)}}>{result.orignl_file_nm}</a>
      )
    }
  }

  return (
    <>
      {downLoadButton()}
    </>
  );

}