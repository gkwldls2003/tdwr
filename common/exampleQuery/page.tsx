'use server'
import { executeQueryAll, executeQuery } from "../utils/databases/mariadb";

export const selectAllData = async () => {
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

export const selectOneData = async () => {
  try {
    const query = 'SELECT * FROM tb_tdwr_work_info where id = ?';
    const result = await executeQuery('tdwr', query, ['1']);
    
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

export const insertData = async () => {
  try {
    const query = 'insert into tb_tdwr_work_info ( latitude, longitude ) values ( ?,?)';
    const result = await executeQuery('tdwr', query, [37.36585704,127.165399]);
    
    if (!result) {
      throw new Error('No data returned');
    }
    result.status
    const data = await result.json();

    if (data.rows > 0) {
      console.log('성공')
    }
    return data.rows
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}