'use client';

import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import Comment from './comment';

interface CommentWrapperProps {
  board_id: number;
  se: string;
}

const CommentWrapper = ({ board_id, se }: CommentWrapperProps) => {
  return (
    <Provider store={store}>
      <Comment board_id={board_id} se={se}/>
    </Provider>
  );
};

export default CommentWrapper;