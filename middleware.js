// middleware.js -> next.js가 next api 요청에 대해 미들웨어 함수를 실행함.
// 미들웨어 목표 : 클라이언트 라우트 보호, api 요청 인증 헤더 추가 
// 미들웨어 실행 순서 
// 클라이언트 요청 -> middleware.js 실행 -> 조건에 따른 처리 : API 요청-> 헤더추가, 보호된 페이지 -> 인증 체크, 로그인 페이지 -> 상태 체크 -> 페이지 또는 라우트 실행
import { NextResponse } from 'next/server'

export function middleware(request) { // next.js가 자동으로 request 객체를 주입(request는 현재 경로, 쿠키, 헤더 속성을 가짐 )
  console.log('미들웨어 실행됨!')
  console.log('요청 경로:', request.nextUrl.pathname)
  console.log('쿠키:', request.cookies)

  // 쿠키에서 토큰 가져오기
  const token = request.cookies.get('accessToken')

  // 요청 경로 구분
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/mypage')


  // API 요청 처리 - 토큰이 있으면 헤더에 추가
  if (isApiRoute && token) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token.value}`)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  }

  // 보호된 페이지 접근 시 토큰 체크
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 이미 로그인된 사용자가 로그인 페이지 접근 시
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/mypage', request.url))
  }
  
 
  return NextResponse.next()
}


// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    '/api/:path*',   // API 경로
    '/login',        // 로그인 페이지
    '/mypage/:path*' // 보호된 페이지
  ]
 }