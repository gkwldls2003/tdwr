'use server'
import { executeQuery, executeQueryAll } from "../../utils/databases/mariadb";

export const selectMapInfoQuery = async () => {
  try {
    const query = 
    `/* map-selectMapInfoQuery 일거리 정보*/
    SELECT 
    *
    FROM tb_tdwr_work_info
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


export const selectMarkerInfoQuery = async (id: string) => {
  try {
    const query = 
    `/* map-selectMapInfoQuery 일거리 정보 */
    SELECT 
    *
    FROM tb_tdwr_work_info
    WHERE id=?`;
    const result = await executeQuery('tdwr', query, [id]);

    if (!result) {
      throw new Error('No data returned');
    }

    // result가 이미 JSON 데이터일 수 있음
    return result.json();
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
};
