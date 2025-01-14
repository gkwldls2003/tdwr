
import { useSession } from 'next-auth/react';
import { insertBoardRecommandQuery, selectBoardRecommandCountUserQuery } from '../../../../common/querys/board/comm/page';
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useAppDispatch } from '../../../../store/hooks';
import { useSelector } from 'react-redux';
import { selectIsLoading, setLoading } from '../../../../store/boardSlice';

interface RecommandComment {
  mapng_key: number; //게시판 or 댓글 번호
  se: string; //자유게시판, 공지게시판, 댓글 등 구분
  good_count: number;
  bad_count: number;
}

export default function RecommandComment(
  { mapng_key, se, good_count, bad_count }: RecommandComment
) {

  const dispatch = useAppDispatch();
  const loading = useSelector(selectIsLoading);
  const { data: session } = useSession();
  const userInfo = session?.user.info;

  async function handleRecommend(type: 'good' | 'bad') {

    if (!userInfo) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    const result = await selectBoardRecommandCountUserQuery([mapng_key, se, userInfo?.user_id]);

    if (result.cnt > 0) {
      alert("이미 추천 또는 비추천하였습니다.");
      return;
    }

    const msg = type === 'good' ? '추천' : '비추천'

    if (confirm(msg + " 하시겠습니까?")) {
      const result = await insertBoardRecommandQuery([mapng_key, se, type, userInfo?.user_id]);

      if (result.rows > 0) {
        dispatch(setLoading(!loading));
      }
    }

  }

  return (
    <>
      <button
        onClick={() => handleRecommend('good')}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
      >
        <ThumbsUp className="w-3 h-3" />
        <span>{good_count}</span>
      </button>

      <button
        onClick={() => handleRecommend('bad')}
        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:text-red-800"
      >
        <ThumbsDown className="w-3 h-3" />
        <span>{bad_count}</span>
      </button>
    </>
  )
}