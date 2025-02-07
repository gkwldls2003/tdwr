export interface BoardFree {
  board_id?: number;
  title?: string;
  cn?: any
  view?: number
  user_nm?: string
  crte_user_id?: number
  crte_dttm?: string
  comment_cnt?: number;
  rcd_good_cnt?: number;
  tot?: number
  }

export interface BoardComment {
  comment_id?: number;
  se: string;
  upper_comment_id?: number;
  board_id?: number;
  sttus?: string;
  cn?: string;
  delete_yn?: string;
  crte_user_id?: number;
  nickname?: string;
  crte_dttm?: string;
  good_count?: number;
  bad_count?: number;
  isLoading?: Boolean;
  }