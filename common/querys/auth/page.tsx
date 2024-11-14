'use server'
import { executeQuery } from "../../utils/databases/mariadb";

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


