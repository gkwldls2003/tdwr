import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Prgm } from "../store/types/prgm"
export default async function middleware(request: NextRequest) {

  const href = request.nextUrl.href;
  const remoteIp = request.headers.get('x-forwarded-for');
  const pathName = request.nextUrl.pathname + request.nextUrl.search;

  let author_id;
  let flag: Boolean = false;

  //공통 접근 허용 url
  const PrgmAccessUrl = [
    '/',
    '/not-found',
    '/api/auth/reqUrl',
    '/api/file/upload',
    '/api/file/ckEditorUpload'
  ];

  //공통 접근 허용 url 정규식
  const PrgmAccessUrlRegExp = [
    '/api/file/download/*',
    '/api/file/ckEditorDownload/*',
  ];

  if (PrgmAccessUrl.includes(pathName)) {
    flag = true;
  }

  for(let i = 0; PrgmAccessUrlRegExp.length > i; i ++ ){
    const regExp = new RegExp(PrgmAccessUrlRegExp[i].toString());
    const match = pathName.match(regExp);
    if (match?.length) {
      flag = true;
    }
  }
  

  //============접속 ip, url start==============
  if (href) {
    await fetch(`${request.nextUrl.origin}/api/auth/reqUrl`, {
      method: 'POST',
      body: JSON.stringify({
        remoteUrl: href,
        remoteIp: remoteIp
      })
    }).catch(console.error);
  } else {
    author_id = 'ROLE_ANONYMOUS'
  }

  //============접속 ip, url end==============


  //사용자 정보 session 조회
  const token: any = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  })
  author_id = token?.info.author_id ? token.info.author_id : 'ROLE_ANONYMOUS'

  //==============권한별 허용 url start==============
  const prgmRes = await fetch(`${request.nextUrl.origin}/api/auth/prgmAuth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ author_id })
  }).catch(console.error);

  if (prgmRes && !flag) {

    const prgmList = await prgmRes.json();

    prgmList.filter((prgm: Prgm) => {
      if (prgm.prgm_cd === "01") {
        if (pathName === prgm.prgm_url) {
          flag = true;
        }
      } else if (prgm.prgm_cd === "02") {
        const regExp = new RegExp(prgm.prgm_url.toString());
        const match = pathName.match(regExp);
        if (match?.length) {
          flag = true;
        }
      }
    })
  }

  //==============권한별 허용 url end==============

  //flag = true 허용, false 권한 없음
  if (flag) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(`${request.nextUrl.origin}/not-found`)
  }

}


// Configuration for middleware paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)', // Apply middleware to all paths except for static files and favicon
  ],
};