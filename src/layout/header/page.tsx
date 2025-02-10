'use client'

import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { insertLogoutHistQuery } from '../../common/querys/auth/page';
import Stack from '@mui/material/Stack';
import { Box, Button, Divider, Typography } from '@mui/material';
import PulseLoaderSpinner from '@/app/components/spinner/PulseLoader';

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
    user = <PulseLoaderSpinner size={10}/>
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
      <Box 
        fontSize={'small'}
        padding={'2px 5px 2px 5px'}
        borderColor={'currentcolor'}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'white',
          color: '#1976d2',
          
        }}
      >
        <Link href="/login" passHref>
            로그인
        </Link>
        <Divider 
          orientation="vertical"
          variant="middle"
          flexItem
          sx={{
            marginLeft: 1,
            marginRight: 1,
            height: '10px'
          }}
          />
        <Link href="/join" passHref>
            회원가입
        </Link>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ backgroundColor: 'white' , width:'100%'}}>
        {/* 헤더 */}
        <Box sx={{
          height: '56px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          width:'1200px',
          margin:'0 auto'
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
