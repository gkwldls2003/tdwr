'use server'
import { executeQueryAll } from "../../utils/databases/mariadb";

export const selectMapInfoQuery = async () => {
  try {
    const query = 'SELECT * FROM tb_tdwr_work_info';
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
