'use server'
import { executeQuery, executeQueryAll } from "../../../utils/databases/mariadb";

export const selectBoardFreeQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-free-selectBoardFreeQuery 자유게시판 조회 */
    select 
        free_id
        ,title
        ,cn
        ,view
        ,crte_user_id
        ,f_cmm_user_nm(crte_user_id) as user_nm
        ,date_format(crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
        ,cast(count(*) over() as decimal(11,0)) as tot
    FROM tb_tdwr_board_free
    where use_yn = 'Y'
    ${params.search_gb === 'all' ? `and (title like concat('%', '${params.search}', '%') or cn like concat('%', '${params.search}', '%'))` : ``}
    ${params.search_gb === 'title' ? `and title like concat('%', '${params.search}', '%')` : ``}
    ${params.search_gb === 'cn' ? `and cn like concat('%', '${params.search}', '%')` : ``}
    order by free_id desc
    ${params.s && params.p? `limit ? offset ? ` : `limit 10 offset 0`}
    `;

    let paramsArr = [];

    if(params.s && params.p) {

      const s = Number(params.s);
      const p = Number(params.p) -1 ;

      paramsArr.push(s);
      paramsArr.push(s * p);
    }

    const result = await executeQueryAll('tdwr', query, paramsArr);
    
    if (!result) {
      throw new Error('No data returned');
    }

    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectOneBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-selectOneBoardFreeQuery 자유게시판 상세 */
    select 
        free_id
        ,title
        ,cn
        ,view
        ,crte_user_id
        ,f_cmm_user_nm(crte_user_id) as user_nm
        ,date_format(crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
    FROM tb_tdwr_board_free
    where use_yn = 'Y'
    and free_id = ?
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

export const insertBoardFreeViewQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-insertBoardFreeViewQuery 자유게시판 상세 조회수 증가 */
    update tb_tdwr_board_free
    set view = view + 1
    where free_id = ?
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

export const insertBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-insertBoardFreeQuery 자유게시판 작성 */
    insert into tb_tdwr_board_free 
    ( title, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, sysdate() ) 
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

export const updateBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-updateBoardFreeQuery 자유게시판 수정 */
    update tb_tdwr_board_free
    set title = ?
        ,cn = ?
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where free_id = ?
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

export const deleteBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-deleteBoardFreeQuery 자유게시판 삭제 */
    update tb_tdwr_board_free
    set use_yn = 'N'
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where free_id = ?
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

export const selectCommentQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-free-selectCommentQuery 자유게시판 댓글조회 */
    with recursive cte as (
    /* Anchor */
    select 
            comment_id
            ,upper_comment_id
            ,board_id
            ,0 AS depth
            ,comment_id as path_start
            ,sttus
            ,if(sttus = 'N', '삭제된 댓글입니다.', cn) as cn
            ,crte_user_id
            ,f_cmm_user_nickname(crte_user_id) as nickname
            ,date_format(crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
        FROM tb_tdwr_board_comment
        where use_yn = 'Y'
        and upper_comment_id is null
        and board_id = ${params.board_id}

        union all

      /* recursive */
        select 
            b.comment_id
            ,b.upper_comment_id
            ,b.board_id
            ,cte.depth + 1
            ,cte.path_start
            ,b.sttus
            ,if(b.sttus = 'N', '삭제된 댓글입니다.', b.cn) as cn
            ,b.crte_user_id
            ,f_cmm_user_nickname(b.crte_user_id) as nickname
            ,date_format(b.crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
        FROM tb_tdwr_board_comment b
        inner join cte on b.upper_comment_id = cte.comment_id
        where b.use_yn = 'Y'
        and b.upper_comment_id is not null
        and b.board_id = ${params.board_id}

    ) select * from cte
    order by path_start, depth, comment_id
    `;
    const result = await executeQueryAll('tdwr', query, []);
    
    if (!result) {
      throw new Error('No data returned');
    }

    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const insertBoardFreeCommentQuery = async (params:any[]) => {
  try {
    const query =
    `
    /* board-free-insertBoardFreeCommentQuery 자유게시판 댓글 등록*/
    insert into tb_tdwr_board_comment 
    ( board_id, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, sysdate() ) 
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

export const updateBoardFreeCommentQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-free-updateBoardFreeCommentQuery 자유게시판 댓글 수정 */
    update tb_tdwr_board_comment
    set cn = ?
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where comment_id = ?
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

export const insertBoardFreeReplyCommentQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-free-insertBoardFreeReplyCommentQuery 자유게시판 답글 등록 */
    insert into tb_tdwr_board_comment 
    ( upper_comment_id, board_id, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, ?, sysdate() ) 
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

export const deleteBoardFreeCommentQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-free-deleteBoardFreeCommentQuery 자유게시판 댓글 삭제 */
    update tb_tdwr_board_comment
    set sttus = 'N'
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where comment_id = ?
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