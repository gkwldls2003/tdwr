import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {

  await fetch(`${request.nextUrl.origin}/api/sys/reqUrl`, {
    method: 'POST',
    body: JSON.stringify({
      remoteUrl: request.headers.get('referer')
      ,remoteIp: request.headers.get('x-forwarded-for')
    })
  }).catch(console.error);
 
  return NextResponse.next();;
}


// Configuration for middleware paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Apply middleware to all paths except for static files and favicon
  ],
};