import springClient from '@/lib/springClient'; // Spring 서버와의 통신용 클라이언트
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // 요청 URL에서 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
    
        const storeId = searchParams.get('storeId');
        const year = searchParams.get('selectedYear');
        const month = searchParams.get('selectedMonth');


        console.log(storeId, year, month);


        // 필수 파라미터 검증
        if (!storeId ) {
            return NextResponse.json(
                { error: '먼저 가게 등록을 해주세요' },
                { status: 400 }
            );
        }

        // Spring Boot 서버로 GET 요청
        const response = await springClient.get(`/finance/transactionchart?storeid=${storeId}&year=${year}&month=${month}`);

        console.log('Spring Boot 응답 데이터: ', response.data);

        // 성공 응답 반환
        return NextResponse.json({ success: true, data: response.data });

    } catch (error) {
      
        return NextResponse.json(
          { error: error.response?.data || 'Spring Boot 서버 오류' },
          { status: error.response?.status || 500 }
        );
    }
}