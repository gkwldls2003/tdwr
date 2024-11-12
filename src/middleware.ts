import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  
  const { nextUrl } = request;

  await fetch(`${request.nextUrl.origin}/api/sys/reqUrl`, {
    method: 'POST',
    body: JSON.stringify({
      info: nextUrl.toString()
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