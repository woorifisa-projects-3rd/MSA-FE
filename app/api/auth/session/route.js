import { cookies } from 'next/headers'
import { NextResponse } from 'next/server' // 기본 http 응답 객체인 response와 유사하지만 Next.js의 서버환경에 특화된 몇가지 기능 제공

export async function GET() {
  try {
    const token = cookies().get('accessToken')?.value

    return NextResponse.json({
      accessToken: token || null
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


// HTTP-Only 쿠키에 토큰 저장
export async function POST(request) {
  try {
    const { accessToken } = await request.json()

    // 서버 사이드에서 httpOnly 쿠키에 토큰 저장(xss 공격 보호)
    cookies().set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 3600 // 1시간
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}



// 쿠키 삭제
export async function DELETE() {
  try {
    cookies().delete('accessToken')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
