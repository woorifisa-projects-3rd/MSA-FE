// app/api/auth/session/route.js
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { accessToken } = await request.json()
    
    // 쿠키에 토큰 저장
    cookies().set('accessToken', accessToken, {

      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1시간
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('accessToken')
    
    return NextResponse.json({
      accessToken: token?.value || null
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    cookies().delete('accessToken')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}