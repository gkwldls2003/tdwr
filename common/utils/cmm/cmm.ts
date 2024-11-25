import { inserFileDataQuery } from "../../querys/cmm/page";

export async function fileUpload(file:File | null, id:number, table:string, colunm_nm:string, user_id: number, sn?: number) {

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
        user_id
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

export function isFileValidate(file:File | null) {
  let isValid = false;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; //파일 최대 크기 2메가
  const ALLOWED_FILE_TYPES = ['jpg','jpeg','png','gif','bmp','pdf','doc','docx','xls','xlsx','ppt','pptx','hwp','hwpx','txt','zip'];

  if (!file) {
    isValid = true;
    alert("파일이 없습니다.");

    return isValid;
  }

  if (file.size > MAX_FILE_SIZE) {
    
    isValid = true;
    alert(`파일 크기는 ${MAX_FILE_SIZE / (1024 * 1024)}MB를 초과할 수 없습니다.`);

    return isValid;
  }

  const fileExt = file.name.split('.')[1];
  if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
    isValid = true;
    alert("지원하지 않는 파일 형식입니다.");

    return isValid;
  }

}