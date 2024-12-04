import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { name, phone_number } = await request.json();
        console.log('Received request:', { name, phone_number });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/president/id-find', { name, phone_number });
        

      
        console.log('Spring Boot 응답:', response.data.message);
        if (response.status === 200) {
            console.log(response.data.email)
            return NextResponse.json( {email: response.data.email},{ status: 200 });
        } 
    } catch (error) {
        // status code > 300 은 다 catch문에서 해결 
	      // 응답 중 data message와 code만 가져와서 client로 보내주고
	      // client도 그것만 활용하기
	    console.log(error.response.data.status)
        const errorMessage = error.response.data.message || '서버 에러가 발생했습니다.';
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ success: false, message: errorMessage }, 
                                 { status: statusCode }); 
    }
}
    