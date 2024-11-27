'use server'
import { executeQuery } from "../../utils/databases/mariadb";

export const inserFileDataQuery = async (params:any[]) => {
  try {
    const query = 
    `
    /* cmm-inserFileDataQuery 공통 파일 맵핑 저장*/
    insert into tb_cmm_file_mapng 
    ( 
      mapng_key
      ,mapng_table
      ,colunm_nm
      ,sn
      ,use_yn
      ,stre_file_nm
      ,orignl_file_nm
      ,file_stre_cours
      ,file_size
      ,ext 
      ,crte_user_id
      ,crte_dttm
      )
    values 
    ( ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? , sysdate() )
    `;
    const result = await executeQuery('tdwr', query, params);

    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    if (data.rows > 0) {
      console.log('성공')
      //data.id 는 insert한 id 반환
    }
    return data
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectOneFileMapngDataQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* cmm-selectOneFileMapngDataQuery 공통 첨부파일 파일 매핑 조회 */
    select 
        stre_file_nm
        ,orignl_file_nm
        ,ext
    from tb_cmm_file_mapng
    where mapng_key = ?
    and mapng_table = ?
    and colunm_nm = ?
    and sn = ?
    and use_yn = 'Y'
    `;
    const result = await executeQuery('tdwr', query, params);
    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectOneFileDataQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* cmm-selectOneFileDataQuery 공통 첨부파일 다운로드 */
    select 
        stre_file_nm
        ,orignl_file_nm
        ,file_stre_cours
        ,ext
    from tb_cmm_file_mapng
    where stre_file_nm = ?
    and use_yn = 'Y'
    `;
    const result = await executeQuery('tdwr', query, params);
    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const inserCkEditorFileDataQuery = async (params:any[]) => {
  try {
    const query = 
    `
    /* cmm-inserCkEditorFileDataQuery 공통 ckeditor 이미지 저장*/
    insert into tb_cmm_ckeditor_file 
    ( 
      use_yn
      ,stre_file_nm
      ,orignl_file_nm
      ,file_stre_cours
      ,file_size
      ,ext
      ,crte_user_id
      ,crte_dttm
      )
    values 
    ( 'Y' ,? ,? ,? ,? ,? ,? ,sysdate() )
    `;
    const result = await executeQuery('tdwr', query, params);

    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    if (data.rows > 0) {
      console.log('성공')
      //data.id 는 insert한 id 반환
    }
    return data
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectOneCkEditorDataQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* cmm-selectOneCkEditorDataQuery 공통 ckeditor 이미지 */
    select 
        stre_file_nm
        ,orignl_file_nm
        ,file_stre_cours
        ,ext
    from tb_cmm_ckeditor_file
    where stre_file_nm = ?
    and use_yn = 'Y'
    `;
    const result = await executeQuery('tdwr', query, params);
    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}