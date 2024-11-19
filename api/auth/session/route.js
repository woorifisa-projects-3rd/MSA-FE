import { cookies } from "next/headers";4

// Next.js의 route.js -> next server에서 사용할 수 있는 api를 만드는 기능


export async function POST(request) {
    const { accessToken } = await request.json()
    
    // httpOnly 쿠키로 저장 (JavaScript로 접근 불가)
    cookies().set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
}