'use client'

import { useState } from "react";
import { fileUpload, isFileValidate } from "../../common/utils/cmm/cmm";
import FileUpload from './../components/file/fileUpload';

export default function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileUpload(e:React.MouseEvent, file:File | null) {
    e.preventDefault();

    //파일 유효성 검사
    if(isFileValidate(file)) return;

    fileUpload(file, 1, 'tb_example', 'example', 1);

  }

  return (
    <div className="p-4">
      <form className="space-y-4">
        <div>
          <FileUpload onChange={(e) => setFile(e.target.files?.[0] || null)}/>
        </div>

        <a
          href="#"
          onClick={(e) => {handleFileUpload(e, file)}}
          className="px-4 py-2 bg-blue-500 text-white rounded
            hover:bg-blue-600 disabled:bg-gray-400"
        >
          업로드
        </a>
      </form>
    </div>
  );

}