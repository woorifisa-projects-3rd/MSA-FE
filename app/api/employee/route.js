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

  export async function DELETE(request) {
    try {
      const { seid } = await request.json();

      const response = await springClient.delete(`/user/employee`, {
        params: { seid : seid },
       });
  
      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Spring Boot 직원 삭제 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  export async function PUT(request) {
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
        address,
        seid
        } = await request.json();
  
      const response = await springClient.put(`/user/employee`, {
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
        params: { seid : seid },
       });
  
      // 성공 응답 반환
      return NextResponse.json({ success: response.data});
    } catch (error) {
      console.error('Spring Boot 직원 수정 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }