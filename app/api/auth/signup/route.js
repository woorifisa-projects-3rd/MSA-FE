import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      const {
        name,
        birthDate,
        address,
        phoneNumber,
        email,
        password,
        termsAccept
        } = await request.json();

      const response = await springClient.post(`/user/president/regist`, {
        name,
        birthDate,
        address,
        phoneNumber,
        email,
        password,
        termsAccept
       });

       if (response.status === 409) {
        return NextResponse.json(
          {
            success: false,
            code: response.data?.code,
            message: response.data?.message,
          },
          { status: 409 }
        );
      }

      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Spring Boot 회원가입 실패:', error.message);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }