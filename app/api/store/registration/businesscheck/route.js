import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { storeName, businessNumber } = await request.json();
        console.log('프론트에서 왔다:', { storeName, businessNumber });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/store/businesscheck', { storeName, businessNumber });
        console.log('최초등록 1단계 response ', response.status, response.data);

        // 응답 처리
        if (response.data === 'ok') {
            return NextResponse.json({ success: true }, { status: 200 });
        } else if(response.data === '이미 존재하는 가게 명입니다') {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
