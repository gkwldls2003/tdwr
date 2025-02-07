'use server'
import { executeQuery, executeQueryAll } from "../../utils/databases/mariadb";

export const selectBoardFreeQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-selectBoardFreeQuery 게시판 조회 */
    select 
        a.board_id
        ,a.title
        ,a.cn
        ,a.view
        ,a.crte_user_id
        ,f_cmm_user_nm(a.crte_user_id) as user_nm
        ,date_format(a.crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
        ,(select count(*) from tb_tdwr_board_comment where board_id = a.board_id) as comment_cnt
        ,(select count(*) from tb_tdwr_board_recommand  where mapng_key = a.board_id and se = '${params.se}' and type = 'good') as rcd_good_cnt
        ,count(*) over() as tot
    from tb_tdwr_board a
    where a.use_yn = 'Y'
    and a.se = '${params.se}'
    ${params.search_gb === 'all' ? `and (a.title like concat('%', '${params.search}', '%') or a.cn like concat('%', '${params.search}', '%'))` : ``}
    ${params.search_gb === 'title' ? `and a.title like concat('%', '${params.search}', '%')` : ``}
    ${params.search_gb === 'cn' ? `and a.cn like concat('%', '${params.search}', '%')` : ``}
    order by a.board_id desc
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
     /* board-selectOneBoardFreeQuery 게시판 상세 */
    select 
        board_id
        ,title
        ,cn
        ,view
        ,crte_user_id
        ,f_cmm_user_nm(crte_user_id) as user_nm
        ,date_format(crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
    FROM tb_tdwr_board
    where use_yn = 'Y'
    and board_id = ?
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const insertBoardFreeViewQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-insertBoardFreeViewQuery 게시판 상세 조회수 증가 */
    update tb_tdwr_board
    set view = view + 1
    where board_id = ?
    and use_yn = 'Y'
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const insertBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-insertBoardFreeQuery 게시판 작성 */
    insert into tb_tdwr_board 
    ( se, title, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, ?, sysdate() ) 
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const updateBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-updateBoardFreeQuery 게시판 수정 */
    update tb_tdwr_board
    set title = ?
        ,cn = ?
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where board_id = ?
    and use_yn = 'Y'
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const deleteBoardFreeQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-deleteBoardFreeQuery 게시판 삭제 */
    update tb_tdwr_board
    set use_yn = 'N'
        ,updt_user_id = ?
        ,updt_dttm = sysdate()
    where board_id = ?
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const selectCommentQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-selectCommentQuery 게시판 댓글조회 */
    with recursive cte as (
    /* Anchor */
        select 
            comment_id
            ,upper_comment_id
            ,board_id
            ,0 AS depth
            ,comment_id as path_start
            ,sttus
            ,cn
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
            ,b.cn
            ,b.crte_user_id
            ,f_cmm_user_nickname(b.crte_user_id) as nickname
            ,date_format(b.crte_dttm, '%Y-%m-%d %H:%i:%s') as crte_dttm
        FROM tb_tdwr_board_comment b
        inner join cte on b.upper_comment_id = cte.comment_id
        where b.use_yn = 'Y'
        and b.upper_comment_id is not null
        and b.board_id = ${params.board_id}

    ) select cte.*
    , count(rcd_good.recommand_id) as good_count
    , count(rcd_bad.recommand_id) as bad_count
    from cte
    left join tb_tdwr_board_recommand rcd_good on cte.comment_id = rcd_good.mapng_key and rcd_good.se = '${params.se}' and rcd_good.type = 'good'
    left join tb_tdwr_board_recommand rcd_bad on cte.comment_id = rcd_bad.mapng_key and rcd_bad.se = '${params.se}' and rcd_bad.type = 'bad'
    group by cte.comment_id
    order by path_start, depth, comment_id
    `;
    const result = await executeQueryAll('tdwr', query);
    
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
    /* board-insertBoardFreeCommentQuery 게시판 댓글 등록*/
    insert into tb_tdwr_board_comment 
    ( board_id, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, sysdate() ) 
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const updateBoardFreeCommentQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-updateBoardFreeCommentQuery 게시판 댓글 수정 */
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
     /* board-insertBoardFreeReplyCommentQuery 게시판 답글 등록 */
    insert into tb_tdwr_board_comment 
    ( upper_comment_id, board_id, cn, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, ?, sysdate() ) 
    `;
    const result = await executeQuery('tdwr', query, params);
    
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

export const deleteBoardFreeCommentQuery = async (params:any[]) => {
  try {
    const query =
     `
     /* board-deleteBoardFreeCommentQuery 게시판 댓글 삭제 */
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
    
    const data = await result.json();

    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const selectBoardRecommandCountQuery = async (params: any) => {
  try {
    //se = board_free 자유게시판, board_free_comment 자유게시판 댓글
    const query = 
    `
    /* board-selectBoardRecommandCountQuery 게시판 추천 비추천 조회 */
    select 
      count(*) as cnt
    from tb_tdwr_board_recommand
    where mapng_key = ?
    and se = ?
    and type = ?
    `;

    const result = await executeQuery('tdwr', query, params);
    
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

export const selectBoardRecommandCountUserQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-selectBoardRecommandCountUserQuery 게시판 추천 비추천 사용자 조회 */
    select 
      count(*) as cnt
    from tb_tdwr_board_recommand
    where mapng_key = ?
    and se = ?
    and crte_user_id = ?
    `;

    const result = await executeQuery('tdwr', query, params);
    
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

export const insertBoardRecommandQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-insertBoardRecommandQuery 게시판 추천 비추천 등록 */
    insert into tb_tdwr_board_recommand 
    ( mapng_key, se, type, crte_user_id, crte_dttm)
    values 
    ( ?, ?, ?, ?, sysdate() ) 
    `;
    const result = await executeQuery('tdwr', query, params);
    
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
