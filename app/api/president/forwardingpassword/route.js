import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { name, email } = await request.json();
        console.log('Received request:', { name, email });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/president/resetPassword', { name, email });
        console.log('Spring Boot 응답:', response.data);

        // 응답 처리
        if (response.data === '임시 비밀번호가 이메일로 전송되었습니다.') {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
        console.error('Spring Boot 요청 실패:', error.message, error.response?.data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
    