import { inserFileDataQuery } from "../../querys/cmm/page";

export default async function fileUpload(file:File | null, id:number, table:string, colunm_nm:string, sn?: number) {

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (!response.ok) throw new Error(data.error);

      const params = [
        id,
        table,
        colunm_nm,
        sn ? sn : 1,
        'Y',
        data.stre_file_nm,
        data.orignl_file_nm,
        data.file_stre_cours,
        data.file_size,
        data.ext,
        1
      ]

      const result = await inserFileDataQuery(params);

      if(result && result.rows > 0) {
        alert('파일 업로드 성공!');
      } else {
        alert('실패!');
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert(error);
    } 
 
}