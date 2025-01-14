import mariadb from 'mariadb';
import { NextResponse } from 'next/server';
import logger from '../log/logger';

/**
 * check, globalObject, registerService
 * Next.js는 개발 모드에서 API 경로를 지속적으로 재구축하는데, initFn()의 경로를 전역으로 지정하여 변경되지 않도록 합니다.
 */
function check(it: false | (Window & typeof globalThis) | typeof globalThis) {
  return it && it.Math === Math && it;
}
const globalObject =
  check(typeof window === 'object' && window) ||
  check(typeof self === 'object' && self) ||
  check(typeof global === 'object' && global) ||
  (() => {
    return this;
  })() ||
  Function('return this')();

const registerService = (name: string, initFn: any) => {
  if (process.env.NODE_ENV === 'development') {
    
    if (!(name in globalObject)) {
      globalObject[name] = initFn();
    }
    return globalObject[name];
  }
  return initFn();
};

// BigInt를 일반 숫자로 변환하는 함수
const convertBigIntToNumber = (obj: any): any => {
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = convertBigIntToNumber(obj[key]);
    }
    return newObj;
  }
  
  return obj;
};

const pools: any = {
  tdwr:
    registerService('mariadb', () => mariadb.createPool({
      host: process.env.MARIADB_TDWR_HOST,
      user: process.env.MARIADB_TDWR_USER,
      password: process.env.MARIADB_TDWR_PASSWORD,
      database: process.env.MARIADB_TDWR_DATABASE,
      port: 3306
    })
  ),
  board:
    registerService('mariadb', () => mariadb.createPool({
      host: process.env.MARIADB_BOARD_HOST,
      user: process.env.MARIADB_BOARD_USER,
      password: process.env.MARIADB_BOARD_PASSWORD,
      database: process.env.MARIADB_BOARD_DATABASE,
      port: 3306
    })
  )
};

const getConnection = async (database: string) => {
  try {
    const conn = await pools[database].getConnection();
    logger.info({
      info: 'Connected to db...!',
      message: ' '
    });
    return conn;
  } catch (err) {
    logger.info({
      info: 'Error connecting to db...',
      message: ' '
    });
    throw err;
  }
}

export async function executeQueryAll(database: string, query: string, params?: any[]) {
  let conn;
  if(!params) {
    params = [];
  }

  try {
    conn = await getConnection(database);

    logger.info({
      info: query,
      message: '============= QUERY INFO =============   \r\n'
    });

    logger.info({
      info: params,
      message: '============= PARAMS INFO =============   '
    });

    let data = await conn.query(query, params);

    //결과값이 bigint를 number로 convert
    data = convertBigIntToNumber(data);

    return NextResponse.json({ data })
  } catch (err: any) {
    logger.info({
      info: err,
      message: ' '
    });
    throw err
  } finally {
    if (conn) conn.release();
  }
}

export async function executeQuery(database: string, query: string, params: any[]) {
  let conn;
  try {
    conn = await getConnection(database);

    logger.info({
      info: query,
      message: '============= QUERY INFO =============   \r\n'
    });

    logger.info({
      info: params,
      message: '============= PARAMS INFO =============   '
    });

    let data = await conn.query(query, params);

    //결과값이 bigint를 number로 convert
    data = convertBigIntToNumber(data);

    if (data && data.affectedRows !== undefined) {
      // INSERT UPDATE, DELETE가 성공적으로 수행된 경우
      return NextResponse.json({ rows: data.affectedRows, id: Number(data.insertId) });
    } else {
      if (data.length > 1) {
        logger.info({
          info: '데이터 2개이상 조회',
          message: ' '
        });
        return NextResponse.json([])
      } else {
        return NextResponse.json(data.length === 1 ? data[0] : data)
      }
    }
    
  } catch (err: any) {
    logger.info({
      info: err,
      message: ' '
    });
    throw err
  } finally {
    if (conn) conn.release();
  }
}

export async function executeMultiQuery(database: string, queries: string[], params: any[], useIdYn: String) {
  let conn: any;
  try {
    conn = await getConnection(database);
    let datRowSum = 0;
    let insertId = 0;

    //transaction start
    conn.beginTransaction();

    for (let idx = 0; idx < queries.length; idx++) {

      if(idx === 0) {
        logger.info({
          info: queries[idx],
          message: '============= QUERY INFO =============   \r\n'
        });
    
        logger.info({
          info: params[idx],
          message: '============= PARAMS INFO =============   '
        });

        let data = await conn.query(queries[idx], params[idx]);

        //결과값이 bigint를 number로 convert
        data = convertBigIntToNumber(data);

        datRowSum += data.affectedRows;
        insertId = Number(data.insertId);
      } else {
          //useIdYn 이 Y 면 새로 생성된 id 추가
        if (useIdYn === 'Y' && idx !== 0) {
          params[idx].unshift(insertId);
        }

        logger.info({
          info: queries[idx],
          message: '============= QUERY INFO =============   \r\n'
        });

        logger.info({
          info: params[idx],
          message: '============= PARAMS INFO =============   '
        });

        let data = await conn.query(queries[idx], params[idx]);

        //결과값이 bigint를 number로 convert
        data = convertBigIntToNumber(data);

        datRowSum += data.affectedRows;
      }

    }

    if (datRowSum > 0) {
      //transaction commit
      await conn.commit();
      logger.info({
        info: 'multiInsert transaction commit',
        message: ' '
      });
    } else {
      //transaction rollback
      logger.info({
        info: 'multiInsert transaction rollback',
        message: ' '
      });
      await conn.rollback();
    }

    // INSERT UPDATE, DELETE가 성공적으로 수행된 경우
    if(useIdYn === 'Y') {
      //data.id 는 insert한 id 반환
      return NextResponse.json({ rows: datRowSum, id: insertId });
    } else {
      return NextResponse.json({ rows: datRowSum });
    }

  } catch (err: any) {
    //transaction rollback
    logger.info({
      info: 'multiInsert transaction rollback2',
      message: ' '
    });
    
    await conn.rollback();
    throw err
  } finally {
    if (conn) conn.release();
  }
}

export default mariadb;