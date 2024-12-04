import { NextResponse } from 'next/server'

export function middleware(request) { // next.js가 자동으로 request 객체를 주입(request는 현재 경로, 쿠키, 헤더 속성을 가짐 )
 
  // 현재 경로
  const pathname = request.nextUrl.pathname;

  // 토큰 확인
  const token = request.cookies.get('accessToken');

  if (token) {
    console.log('토큰 있음:', token.value);
  } else {
    console.log('토큰 없음');
  }


  // 공개 경로 (no-sidebar) - 항상 접근 가능
  // const publicPaths = [
  //   '/(auth)/login',
  //   '/(auth)/signup',
  //   '/(auth)/change-password',
  //   '/employee/[storeid]/commute/[email]',
  // ]


  // 보호된 경로 (with-sidebar) - 토큰 필요
  const protectedPaths = [
    '/attendance',
    '/employee/management',
    '/financial-products',
    '/mypage',
    '/payroll-auto-transfer',
    '/transactions'
  ]
  

  // 토큰이 없는 경우
  if (!token) {
    // 보호된 경로 접근 시도하면 onboarding으로 리다이렉트
    if (protectedPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

   // 3. 토큰이 있는 경우 
   if (token) {
    // 이미 로그인한 사용자가 onboarding 페이지 접근 시도하면 mypage로 리다이렉트
    if (pathname === '/onboarding') {
      return NextResponse.redirect(new URL('/mypage', request.url))
    }
  }

  // 그 외의 경우 그냥 통과
  return NextResponse.next()
}


// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    // no-sidebar (공개 경로)
    '/(auth)/login/:path*',
    '/(auth)/signup/:path*',
    '/(auth)/change-password/:path*',
    '/employee/:storeid/commute/:path*',
    '/onboarding/:path*',
    
    // with-sidebar (보호된 경로)
    '/attendance/:path*',
    '/employee/:path*', 
    '/financial-products/:path*',
    '/mypage/:path*',
    '/payroll-auto-transfer/:path*',
    '/transactions/:path*',
  ]
}