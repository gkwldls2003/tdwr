'use client'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'
import { BoardComment } from '../../../store/types/board';
import {
  insertBoardCommentQuery
  , insertBoardReplyCommentQuery
  , selectCommentQuery
  , updateBoardCommentQuery
  , deleteBoardCommentQuery
} from '../../../common/querys/board/page';
import Image from 'next/image';
import arrow_reply from '../../../../public/images/arrow_reply.png';
import RecommandComment from './recommandComment';
import { selectIsLoading, setLoading } from '../../../store/boardSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export default function Comment({ board_id, se }: BoardComment) {
  const isloading = useAppSelector(selectIsLoading);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userInfo = session?.user.info;
  const [cn, setCn] = useState('');
  const [commentList, setCommentList] = useState<BoardComment[]>([]);
  const [editingId, setEditingId] = useState<number>(0); //댓글 수정 id
  const [editCn, setEditCn] = useState<string>(''); //댓글 수정 내용
  const [replyingId, setReplyingId] = useState<number>(0); //답글 수정 id
  const [replyCn, setReplyCn] = useState<string>(''); //답글 내용

  useEffect(() => {
    getCommentList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isloading])

  async function handleCreateComment() {
    if (!userInfo) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    if (cn === '') {
      alert('댓글을 입력해주세요.');
      return;
    }
    const result = await insertBoardCommentQuery([board_id, cn, userInfo?.user_id]);

    if (result.rows > 0) {
      setCn('');
      dispatch(setLoading(!isloading));
    }
  }

  async function getCommentList() {
    const result = await selectCommentQuery({ board_id: board_id, se: se });
    setCommentList(result.data);
  }

  async function handleDeleteComment(comment_id: number) {
    if (confirm('해당 댓글을 삭제하시겠습니까?')) {
      const result = await deleteBoardCommentQuery([userInfo?.user_id, comment_id]);

      if (result.rows > 0) {
        setCn('');
        dispatch(setLoading(!isloading));
      }
    }
  }

  async function handleUpdateComment(comment_id: number) {
    if (confirm('해당 댓글을 수정하시겠습니까?')) {
      const result = await updateBoardCommentQuery([editCn, userInfo?.user_id, comment_id]);

      if (result.rows > 0) {
        setCn('');
        setEditingId(0);
        dispatch(setLoading(!isloading));
      }
    }
  }

  async function handleReplyComment(comment_id: number, board_id: number) {
    if (!userInfo) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }

    if (replyCn === '') {
      alert('답글을 입력해주세요.');
      return;
    }

    if (confirm('답글을 등록하시겠습니까??')) {
      const result = await insertBoardReplyCommentQuery([comment_id, board_id, replyCn, userInfo?.user_id]);

      if (result.rows > 0) {
        setReplyCn('');
        setReplyingId(0);
        dispatch(setLoading(!isloading));
      }
    }
  }

  return (
    <>
      <div>
        <textarea
          placeholder={userInfo ? '댓글을 입력해주세요.' : '로그인 후 댓글을 입력하실 수 있습니다.'}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          id='cn'
          onChange={(e) => { setCn(e.target.value) }}
          value={cn}
        />
      </div>
      <div>
        <button
          onClick={handleCreateComment}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >등록
        </button>
      </div>
      <ul className="space-y-4">
        {commentList.map((vo: BoardComment, i: number) => (
          <li key={i} className="p-4 border-b border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100">
            {/* sttus값이 N인경우 삭제된 텍스트 표시 */}
            {vo.sttus === 'N' ? <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">삭제된 댓글입니다.</p> : (
              <div className="flex items-start space-x-2">
                {/* 답글인 경우에만 화살표 이미지 표시 */}
                {vo.upper_comment_id && (
                  <div className="mt-2">
                    <Image src={arrow_reply} alt='답글 이미지' />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-700">
                    <div className="flex items-center gap-2 ml-2">
                      {vo.nickname}
                      <span className="ml-2 text-xs text-gray-500">{vo.crte_dttm}</span>
                      <RecommandComment
                        mapng_key={vo.comment_id!}
                        se={se}
                        good_count={vo.good_count!}
                        bad_count={vo.bad_count!}
                      />
                    </div>
                  </div>
                  {/* 댓글 수정 폼 */}
                  {editingId === vo.comment_id ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={editCn}
                        onChange={(e) => setEditCn(e.target.value)}
                        rows={3}
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleUpdateComment(vo.comment_id!)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          수정완료
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(0);
                            setEditCn('');
                          }}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{vo.cn}</p>
                      <div className="space-x-2">
                        {/* 댓글만 답글 버튼 보이도록 */}
                        {!vo.upper_comment_id && (<button
                          onClick={() => setReplyingId(vo.comment_id!)}
                          className="text-xs"
                        >
                          답글
                        </button>)}

                        {/* 수정, 삭제 버튼 */}
                        {vo.crte_user_id === userInfo?.user_id || userInfo?.author_id === 'ROLE_ADMIN' ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(vo.comment_id!);
                                setEditCn(vo.cn!);
                              }}
                              className="text-xs"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteComment(vo.comment_id!)}
                              className="text-xs"
                            >
                              삭제
                            </button>
                          </>
                        ) : null}
                      </div>
                    </>
                  )}
                  {/* 답글 입력 폼 */}
                  {replyingId === vo.comment_id && (
                    <div className="mt-3 ml-4">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="답글을 입력하세요."
                        value={replyCn}
                        onChange={(e) => setReplyCn(e.target.value)}
                        rows={2}
                      />
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleReplyComment(vo.comment_id!, vo.board_id!)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          답글등록
                        </button>
                        <button
                          onClick={() => {
                            setReplyingId(0);
                            setReplyCn('');
                          }}
                          className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
