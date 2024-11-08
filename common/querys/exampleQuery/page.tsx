'use server'
import { executeQueryAll, executeQuery, executeMultiQuery } from "../../utils/databases/mariadb";

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
      //data.id 는 insert한 id 반환
    }
    return data
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}

export const multiInsertData = async () => {

  try {
    const queries = [
      'INSERT INTO tb_tdwr_work_info (latitude, longitude) VALUES ( ?, ? )',
      'INSERT INTO tb_example (id, Column1) VALUES ( ?, ? )'
    ];
    // const queries = [
    //   'update tb_tdwr_work_info set latitude = ?, longitude = ? where id = ?',
    //   'update tb_example set Column1 = ? where id = ?'
    // ];

    const params = [
      [37.36585704,127.165399],
      ['이름2']
    ]

    // const params = [
    //   [37.36585704,127.165399, 11],
    //   ['이름2', 11]
    // ]

    //첫번째 insert해서 생긴 id 계속 사용하려면 Y 아니면 N
    const result = await executeMultiQuery('tdwr', queries, params, 'Y');
    const data = await result.json();

    if (data.rows > 0 ) {
      console.log('multiInsert 성공')
    } else {
      console.log('multiInsert 실패')
    }

    console.log(data)

    return data
  } catch (error) {
    console.error('Error:', error);
    return null; 
  }
}