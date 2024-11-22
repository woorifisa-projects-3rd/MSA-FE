import springClient from "@/lib/springClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const storeid = searchParams.get('storeid');
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  console.log(storeid, year, month);

  if (!storeid || !year || !month) {
    return NextResponse.json({ message: 'Missing query parameters' }, { status: 400 });
  }

  try {
    // Spring Boot로 요청 보내기
    const response = await springClient.get('/attendance/commute/monthly', {
        params: {
          storeid,
          year,
          month,
        },
    });

    console.log('Response from Spring Boot:', response.data);

    // Spring Boot 응답 데이터 반환
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (error.response) {
        // Spring Boot가 반환한 에러
        console.error('Spring Boot Error:', error.response.data);
        return NextResponse.json(error.response.data, { status: error.response.status });
      }
    
      // 네트워크 에러 또는 기타 문제
      console.error('Unknown Error:', error);
      return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}
