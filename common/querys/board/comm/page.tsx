'use server'
import { executeQuery } from "../../../utils/databases/mariadb";

export const selectBoardRecommandCountQuery = async (params: any) => {
  try {
    //se = board_free 자유게시판, board_free_comment 자유게시판 댓글
    const query = 
    `
    /* board-comm-selectBoardRecommandCountQuery 게시판 추천 비추천 조회 */
    select 
      count(*) as cnt
    from tb_tdwr_board_recommand
    where board_id = ?
    and se = ?
    and type = ?
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

export const selectBoardRecommandCountUserQuery = async (params: any) => {
  try {
    const query = 
    `
    /* board-comm-selectBoardRecommandCountUserQuery 게시판 추천 비추천 사용자 조회 */
    select 
      count(*) as cnt
    from tb_tdwr_board_recommand
    where board_id = ?
    and se = ?
    and crte_user_id = ?
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

export const insertBoardRecommandQuery = async (params:any[]) => {
  try {
    const query =
    `
     /* board-comm-insertBoardRecommandQuery 게시판 추천 비추천 등록 */
    insert into tb_tdwr_board_recommand 
    ( board_id, se, type, crte_user_id, crte_dttm)
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


