import { NextApiRequest, NextApiResponse } from 'next';
import { selectUserAuthPrgmQuery } from '../../../../common/querys/auth/page';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { author_id } = req.body;
    const prgmList = await selectUserAuthPrgmQuery([author_id]);
    return res.status(200).json(prgmList.data);
  } catch (error) {
    console.error('Error in auth check:', error);
    return res.status(500).json({ message: '500 error' });
  }
}