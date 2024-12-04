import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {
        // URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const paystatementid = searchParams.get("paystatementid");

        if (!paystatementid) {
            return NextResponse.json({ error: "paystatementid가 필요합니다." }, { status: 400 });
        }

        console.log("쿼리 파라미터 - paystatementid:", paystatementid);

        // Spring Boot로 급여 명세서 요청
        const response = await springClient.get(`/attendance/paystatement/url`, {
            params: { paystatementid },
        });

        console.log("Spring Boot 응답 데이터:", response.data);

        // 성공 응답 반환
        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Spring Boot 요청 실패:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

