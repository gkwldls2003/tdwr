'use server'
import { executeQueryAll, executeQuery } from "../utils/databases/mariadb";

export const selectAllData = async () => {
  try {
    const query = 'SELECT * FROM board';
    const result = await executeQueryAll('board', query, []);
    
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
    const query = 'SELECT * FROM board where uid = ?';
    const result = await executeQuery('board', query, ['160']);
    
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
    const query = 'insert into board ( title, content, writer ) values ( ?,?,?)';
    const result = await executeQuery('board', query, ['테스트','내용','작성자']);
    
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