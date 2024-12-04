export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await springClient('/user/president/mypage');
        
        return NextResponse.json(response.data);
    } catch (error) {
      
        return NextResponse.json(
            { 
                error: error.response?.data?.message || "사용자 정보가 없습니다."
            },
            { 
                status: error.response?.status || 500 
            }
        );
    }
}