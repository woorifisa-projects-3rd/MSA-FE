import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

// 직원 계좌 확인 코드
export async function POST(request) {
    try {
    
      // 클라이언트에서 보낸 데이터 받기
      const { name, accountNumber, bankCode } = await request.json();
      console.log("클라에서 넘어왔다.:", name, bankCode, accountNumber);
  
      
      // Spring Boot로 계좌 확인 요청
      const response = await springClient.post('/user/employee-account-check', {
        name,
        accountNumber,
        bankCode,
      });
      
      console.log("스프링에서 넘어 왔다.:", response.data);
  
      if (response.data) {
        // 성공 응답 반환
        return NextResponse.json({success: true, message: '계좌가 유효합니다.',});
      } else {
        // 유효하지 않은 경우 응답 반환
        return NextResponse.json({success: false,message: '계좌가 유효하지 않습니다.',
        });
      }
    } catch (error) {
      console.error('Spring Boot 계좌 확인 요청 실패:', error.message);
      // 에러 응답 반환
      return NextResponse.json(
        { success: false, message: '계좌 확인 중 오류가 발생했습니다.', error: error.message },
        { status: 500 }
      );
    }
  }
  