import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export default async function middleware(request: NextRequest) {

  const token:any = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  })

    console.log(token?.info.author_id)

  const referer = request.headers.get('referer');;
  const remoteIp = request.headers.get('x-forwarded-for');

  if(referer) {
    await fetch(`${request.nextUrl.origin}/api/sys/reqUrl`, {
      method: 'POST',
      body: JSON.stringify({
        remoteUrl: referer,
        remoteIp: remoteIp
      })
    }).catch(console.error);
  }
  return NextResponse.next();
}


// Configuration for middleware paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)', // Apply middleware to all paths except for static files and favicon
  ],
};