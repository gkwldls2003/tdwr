'use client'

import { useState } from "react";
import fileUpload from "../../../common/utils/cmm/cmm";

export default function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileUpload(e:React.MouseEvent, file:File | null) {
    e.preventDefault();
    fileUpload(file, 1, 'tb_example', 'example');

  }

  return (
    <div className="p-4">
      <form className="space-y-4">
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
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