import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export function middleware(request) {
  const sessionToken = cookies().get('session_token')
  
  if (sessionToken) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${sessionToken.value}`)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}