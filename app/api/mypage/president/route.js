import { NextResponse } from 'next/server'
import springClient from '@/lib/springClient';

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await springClient('/user/president/mypage');
        console.log("/use/president/mypage 스프링 서버로 요청시 응답: ", response.data);
        
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}