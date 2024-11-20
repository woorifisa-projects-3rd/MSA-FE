import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      const {
        name,
        email,
        birthDate,
        sex,
        phoneNumber,
        employmentType,
        bankCode,
        accountNumber,
        salary,
        paymentDate,
        address
        } = await request.json();
  
        const storeid = 1;
      const response = await springClient.post(`/user/employee`, {
        name,
        email,
        birthDate,
        sex,
        phoneNumber,
        employmentType,
        bankCode,
        accountNumber,
        salary,
        paymentDate,
        address
       }, {
        params: {storeid : storeid},
       });
  
      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Spring Boot 직원 추가 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }