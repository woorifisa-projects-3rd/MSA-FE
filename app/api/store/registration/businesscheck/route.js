import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { storeName, businessNumber } = await request.json();
        console.log('프론트에서 왔다:', { storeName, businessNumber });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/store/businesscheck', { storeName, businessNumber });
        console.log('최초등록 1단계 response ', response.data);

        // 응답 처리
        if (response.data === true) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
        console.error('Spring Boot 요청 실패:', error.message, error.response?.data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
    