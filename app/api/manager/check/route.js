import { NextResponse } from 'next/server'
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await springClient('/user/manager/check');
        console.log("/use/manager/check 스프링 서버로 요청시 응답: ", response.status);
        
        return NextResponse.json(response.status);
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