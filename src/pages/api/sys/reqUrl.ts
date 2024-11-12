import type { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../../../common/utils/log/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const reqData = JSON.parse(req.body);

  logger.info({
    info: reqData.remoteUrl,
    message: "============= RequestURL INFO =============" 
  });

  logger.info({
    info: reqData.remoteIp,
    message: "============= RequestIp INFO =============" 
  });


  res.status(200).json({ message: 'Logged successfully' });
}