import PdfspringClient from '@/lib/PdfspringClient'
import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('Next.js /finance/analytics/transactionpdf 호출됨');
  
    try {
      const { searchParams } = new URL(request.url);
      const storeid = searchParams.get('storeid');
      const year = searchParams.get('year');
      const month = searchParams.get('month');
      const taxtype = searchParams.get('taxtype');
  
      if (!storeid || !year || !month || !taxtype) {
        return NextResponse.json(
          { error: '필수 파라미터(storeid, year, month)가 누락되었습니다.' },
          { status: 400 }
        );
      }
  
      const response = await PdfspringClient.post(
        `/finance/simple-ledger-pdf?storeid=${storeid}&year=${year}&month=${month}&taxtype=${taxtype}`,
        null,
        { responseType: 'arraybuffer' } // PDF 데이터를 정확히 가져오기 위해 설정
      );
  
      return new NextResponse(response.data, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': response.headers['content-length'],
        },
      });
    } catch (error) {
      console.error('Spring Boot 요청 실패:', error.message);
      return NextResponse.json(
        { error: error.response?.data || 'Spring Boot 서버 오류' },
        { status: error.response?.status || 500 }
      );
    }
  }
  