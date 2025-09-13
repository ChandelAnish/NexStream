import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("hello")
  // Get the response
  const response = NextResponse.next(); // NextResponse.next() tells Next.js to continue processing the request as usual. You're using response to modify the outgoing headers before continuing.

  // Add CORS headers
    const allowedOrigins = ['http://localhost:3000', 'http://192.168.29.11:3000', 'https://medmin.vercel.app'];
    const origin = request.headers.get('Origin');

    if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
    response.headers.set('Access-Control-Allow-Origin', 'null');
    }
//   response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000'); 


  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// Configure the middleware to run only on API routes. 
export const config = {
  matcher: '/api/:path*', // This means: The middleware only runs for any API route, like: /api/something,  /api/users/123,  etc.
};
