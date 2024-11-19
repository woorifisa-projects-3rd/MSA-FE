import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // 쿼리 파라미터에서 storeId 추출
        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('storeId');

        if (!storeId) {
            return NextResponse.json(
                { error: 'storeId가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 서버에서 토큰 가져오기 (서버 사이드에서)
        const token = cookies().get('accessToken')?.value;

        if (!token) {
            return NextResponse.json(
                { error: '토큰이 존재하지 않습니다.' },
                { status: 401 }
            );
        }

        // Spring Boot 서버로 요청
        const response = await fetch(`http://localhost:8888/user/employee/details?storeid=${storeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                {
                    errorCode: errorData.code,    
                    errorMessage: errorData.message || '알 수 없는 오류가 발생했습니다.' // BE 예외 처리 message를 받아옴
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('직원 정보 가져오기 실패:', error.message);
        return NextResponse.json(
            { error: error.message || '직원 정보를 가져오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
