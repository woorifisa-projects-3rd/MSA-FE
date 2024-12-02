import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {
        // 쿼리 파라미터 받기
        const url = new URL(request.url);
        const storeId = url.searchParams.get('storeid');
        const year = url.searchParams.get('year');
        const month = url.searchParams.get('month');

        // Spring Boot로 급여 명세서 요청
        // const response = await springClient.get(`/attendance/paystatement?storeid=${storeId}&year=${year}&month=${month}`);
        const response = await springClient.get(`/attendance/paystatement?storeid=${storeId}&year=${year}&month=${month}`);
        console.log("넥스트서버 response", response)
        // 성공 응답 반환
        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Spring Boot 요청 실패:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
