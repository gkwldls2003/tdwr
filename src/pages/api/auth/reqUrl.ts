import type { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../../../common/utils/log/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const reqData = JSON.parse(req.body);

  logger.info({
    info: reqData.remoteUrl,
    message: "============= RequestURL INFO =============" 
  });

  logger.info({
    info: reqData.remoteIp,
    message: "============= RequestIp INFO =============" 
  });


  res.status(200).json({ url: reqData.remoteUrl ,ip: reqData.remoteIp });
    
  } else if(req.method === 'GET') {

    const remoteUrl = req.headers['referer'];
    const remoteIp = req.headers['x-forwarded-for'];
    res.status(200).json({ url: remoteUrl ,ip: remoteIp });

  } else {
    return res.status(405).end();
  }

  
}