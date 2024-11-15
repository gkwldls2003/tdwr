'use server'
import { executeQuery, executeQueryAll } from "../../utils/databases/mariadb";

export const selectUserInfoQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* auth-selectUserInfoQuery 사용자 정보 조회 */
    SELECT 
        a.user_id
        ,a.login_id
        ,a.user_nm
        ,a.passwd
        ,b.author_id
    FROM tb_cmm_user a
    left join tb_cmm_user_auth b on b.user_id = a.user_id
    where a.login_id = ?
    and a.use_yn = 'Y'
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

export const insertLoginHistQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* auth-insertLoginHistQuery 사용자 로그인 내역 */
    insert into tb_cmm_login_hist
    (user_id, login_ip, login_mthd, crte_dttm) 
    values 
    ( ?, ?, ?, SYSDATE())
     ;
    `;
    const result = await executeQuery('tdwr', query, params);
    
    if (!result) {
      throw new Error('No data returned');
    }
    
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const insertLogoutHistQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* auth-insertLogoutHistQuery 사용자 로그아웃 내역 */
    insert into tb_cmm_login_hist
    (user_id, login_ip, login_mthd, crte_dttm) 
    values 
    ( ?, ?, ?, SYSDATE())
     ;
    `;
    const result = await executeQuery('tdwr', query, params);
    
    if (!result) {
      throw new Error('No data returned');
    }
    
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectUserAuthPrgmQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* auth-selectUserAuthPrgmQuery 사용자 권한 프로그램 조회 */
    select 
        a.prgm_id
        ,a.prgm_nm_kr
        ,a.prgm_nm_en
        ,a.prgm_cd
        ,a.prgm_dc
        ,a.prgm_url
    from tb_cmm_prgm a
    left join tb_cmm_auth_prgm b on b.prgm_id = a.prgm_id
    where b.author_id = ?
    `;
    const result = await executeQueryAll('tdwr', query, params);
    
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

export const selectCommCodeQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* auth-selectCommCodeQuery 공통코드 조회 */
    select 
        code_id
        ,code_detail
        ,code_nm
        ,code_dc
    from tb_cmm_code_detail
    where code_id = ?
    and use_yn = 'Y'
    order by sn
    `;
    const result = await executeQueryAll('tdwr', query, params);
    
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


