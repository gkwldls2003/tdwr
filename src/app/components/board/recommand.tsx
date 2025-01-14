'use client'

import { useEffect, useState } from 'react'
import { BoardComment } from '../../../../store/types/board';
import { useSession } from 'next-auth/react';
import { insertBoardRecommandQuery, selectBoardRecommandCountQuery, selectBoardRecommandCountUserQuery } from '../../../../common/querys/board/comm/page';
import { ThumbsUp, ThumbsDown } from 'lucide-react'


export default function Recommand({ board_id }: BoardComment) {

  const { data: session } = useSession();
  const userInfo = session?.user.info;
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [goodCount, setGoodCount] = useState<number>(0);
  const [badCount, setBadCount] = useState<number>(0);

  async function getGoodList() {
    const result = await selectBoardRecommandCountQuery([board_id, 'board_free', 'good']);
    setGoodCount(result.cnt);
  }

  async function getBadList() {
    const result = await selectBoardRecommandCountQuery([board_id, 'board_free', 'bad']);
    setBadCount(result.cnt);
  }

  async function handleRecommend(type: 'good' | 'bad') {

    if (!userInfo) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    const result = await selectBoardRecommandCountUserQuery([board_id, 'board_free', userInfo?.user_id]);

    if(result.cnt > 0) {
      alert("이미 추천 또는 비추천하였습니다.");
      return;
    }

    const msg = type === 'good' ? '추천' : '비추천'

    if(confirm(msg + " 하시겠습니까?")) {
      const result = await insertBoardRecommandQuery([board_id, 'board_free', type, userInfo?.user_id]);

      if (result.rows > 0) {
        setIsLoading(!isLoading);
      }
    }


    
  }

  useEffect(() => {
    getGoodList();
    getBadList();

  }, [isLoading])

  
  return (
    <>
      <div className="flex justify-center gap-4 p-4">
      <button
        onClick={() => handleRecommend('good')}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
      >
        <ThumbsUp className="w-5 h-5" />
        <span className="mr-1">추천</span>
        <span className="px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
          {goodCount}
        </span>
      </button>

      <button
        onClick={() => handleRecommend('bad')}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors bg-red-100 rounded-full hover:bg-red-200"
      >
        <ThumbsDown className="w-5 h-5" />
        <span className="mr-1">비추천</span>
        <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
          {badCount}
        </span>
      </button>
    </div>
    </>
  )
}