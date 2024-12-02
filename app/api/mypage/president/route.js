export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await springClient('/user/president/mypage');
        console.log("/use/president/mypage 스프링 서버로 요청시 응답: ", response.data);
        
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Spring Boot 서버 에러:', {
            status: error.response?.status,
            message: error.response?.data?.message,
            error: error.message,
            fullError: error.response?.data
        });
      
        return NextResponse.json(
            { 
                error: error.response?.data?.message || error.message 
            },
            { 
                status: error.response?.status || 500 
            }
        );
    }
}