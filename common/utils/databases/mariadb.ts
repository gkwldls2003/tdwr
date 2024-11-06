import { error } from 'console';
import mariadb from 'mariadb';
import { NextResponse } from 'next/server';
import { insertData } from './../../querys/exampleQuery/page';

const pools:any = {
  tdwr: mariadb.createPool({
    host: process.env.MARIADB_TDWR_HOST,
    user: process.env.MARIADB_TDWR_USER,
    password: process.env.MARIADB_TDWR_PASSWORD,
    database: process.env.MARIADB_TDWR_DATABASE,
    port: 3306
  }),
  board: mariadb.createPool({
    host: process.env.MARIADB_BOARD_HOST,
    user: process.env.MARIADB_BOARD_USER,
    password: process.env.MARIADB_BOARD_PASSWORD,
    database: process.env.MARIADB_BOARD_DATABASE,
    port: 3306
  })
};

const getConnection = async (database:string) => {
  try {
    const conn = await pools[database].getConnection();
    console.log('Connected to db...!');
    return conn;
  } catch (err) {
    console.log('Error connecting to db...', err);
    throw err; 
  }
}

export async function executeQueryAll(database: string, query: string, params: any[]) {
  let conn;
  try {
      conn = await getConnection(database);
      const data = await conn.query(query, params);
      return NextResponse.json({data})
  } catch (err:any) {
      throw err
  } finally {
      if (conn) conn.end();
  }
}

export async function executeQuery(database: string, query: string, params: any[]) {
  let conn;
  try {
      conn = await getConnection(database);
      const data = await conn.query(query, params);

      if (data && data.affectedRows !== undefined) {
        // INSERT UPDATE, DELETE가 성공적으로 수행된 경우
        return NextResponse.json({ rows: data.affectedRows, id: Number(data.insertId) });
      } else {
        if(data.length > 1) {
          console.log('데이터 2개이상 조회')
          return NextResponse.json([])
        } else {
          return NextResponse.json(data[0])
        }
      }
  } catch (err:any) {
      throw err
  } finally {
      if (conn) conn.end();
  }
}

export default mariadb;