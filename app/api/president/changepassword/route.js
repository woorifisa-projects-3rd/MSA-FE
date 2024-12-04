import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function PUT(request) {
  try {
      // 클라이언트에서 보낸 데이터 받기
      const requestBody = await request.json(); // JSON 데이터를 먼저 파싱
      const { beforePassword, newPassword } = requestBody; // 이후 destructuring
      console.log("클라에서 넘어 왔다.", requestBody);

      // Spring Boot로 로그인 요청
      const response = await springClient.put('/user/president/change-password', { beforePassword, newPassword });
      console.log("Next server에서 Spring Boot에서 받은 response:", response.statusText);

      if (response.statusText === 'OK') {
          return NextResponse.json({ success: true }, { status: 200 });
      } 
  } catch (error) {
          // status code > 300 은 다 catch문에서 해결 
	      // 응답 중 data message와 code만 가져와서 client로 보내주고
	      // client도 그것만 활용하기
	     
          
          const errorMessage = error.response?.data.message || '서버 에러가 발생했습니다.';
          const statusCode = error.response?.status || 500;
          console.log(errorMessage);
          return NextResponse.json({ success: false, message: errorMessage }, 
                                   { status: statusCode }); 
                               
 }
}