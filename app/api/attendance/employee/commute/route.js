import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      // 클라이언트에서 보낸 데이터 받기
      const {latitude,longitude,endpoint,storeId,email } = await request.json();
      
      console.log(latitude,longitude,endpoint,storeId,email);
      
  
      // Spring Boot로 로그인 요청
      const response = await springClient.post(`/attendance/${endpoint}`, { storeId,email,latitude, longitude });
    
      const statusCode=response.status;
      
      let message="";
        if (statusCode === 200) {
          message = endpoint === 'go-to-work' ? '출근이 성공적으로 기록되었습니다.' : '퇴근이 성공적으로 기록되었습니다.'
      } else if (statusCode === 202 && endpoint === 'go-to-work') {
          message ='출근이 성공적으로 되었으나 이전 퇴근을 찍지 않으셨습니다 사장님께 연락해주세요'
      } else if (statusCode === 400 && endpoint === 'leave-work') {
          message = '출근을 찍어주세요'
      } else if (statusCode === 403) {
          message = '위치가 다릅니다'
      } else {
          message = '서버 오류입니다'
      }

      console.log("여기요");
      
      // 성공 응답 반환
      return new NextResponse(JSON.stringify({
        statusCode: statusCode, // 202 상태 코드 포함
        message: message
      }));
    } catch (error) {
      console.error('Spring Boot 직원 출퇴근 요청 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }