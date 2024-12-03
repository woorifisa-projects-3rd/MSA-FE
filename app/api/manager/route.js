import { NextResponse } from 'next/server'
import springClient from '@/lib/springClient';
import { CopySlash } from 'lucide-react';

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await springClient('/user/manager/president');
        console.log("/use/manager/president 스프링 서버로 요청시 응답: ", response.data);
        
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

export async function DELETE(request) {
    try {
      const { presidentid } = await request.json();

      const response = await springClient.delete(`/user/manager/president/${presidentid}`, {
        params: { presidentid : presidentid },
       });

       console.log("사장님 삭제 성공");
  
      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Spring Boot 사장님 삭제 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }