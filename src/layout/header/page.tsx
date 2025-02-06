'use client'

import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { insertLogoutHistQuery } from '../../../common/querys/auth/page';
import Stack from '@mui/material/Stack';
import { Box, Button, Typography } from '@mui/material';

export default function Header() {

  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  let user;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      if (userInfo) {
        const ipRes = await fetch(`/api/auth/reqUrl`);
        const data = await ipRes.json();

        // 로그아웃 이력 저장
        const params = [userInfo.user_id, data.ip, '02'];

        await insertLogoutHistQuery(params);
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
    }
  };

  if (status === 'loading') {
    user = '로딩 중입니다...';
  } else if (session) {
    user = (
      <>
        <Typography variant="body1">{userInfo?.user_nm}님</Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 1,
            '&:hover': { backgroundColor: '#f1f1f1' },
          }}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </>
    );
  } else {
    user = (
      <Stack direction="row" spacing={0} alignItems="center">
        <Link href="/login" passHref>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 1,
              '&:hover': { backgroundColor: '#f1f1f1' },
            }}
          >
            로그인
          </Button>
        </Link>
        <Link href="/join" passHref>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 1,
              color: '#1976d2',
              '&:hover': { backgroundColor: '#f1f1f1' },
            }}
          >
            회원가입
          </Button>
        </Link>
      </Stack>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: 'white' }}>
        {/* 헤더 */}
        <Box sx={{
          height: '56px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }}>
          {/* 왼쪽: 로고 및 메뉴 */}
          <Stack direction="row" spacing={3} alignItems="center">
            {/* 로고 */}
            <Box sx={{ color: 'rgb(59 130 246)', fontWeight: 'bold', fontSize: '1.25rem' }}>
              <Link href={`/`} style={{ textDecoration: 'none', color: 'inherit' }}>오늘의 일</Link>
            </Box>
          </Stack>

          {/* 오른쪽: 사용자 메뉴 */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Link href={`/board/free`} style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ '&:hover': { color: '#1f2937' } }}>
                자유게시판
              </Typography>
            </Link>

            {/* 사용자 상태 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {user}
            </Box>

            <Button variant="outlined" size="small" sx={{ color: 'rgb(59 130 246)', '&:hover': { backgroundColor: '#f1f1f1' } }}>
              노무사무실 가입/광고문의
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
