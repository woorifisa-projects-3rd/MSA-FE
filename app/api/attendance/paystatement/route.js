import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // 쿼리 파라미터 받기
        const url = new URL(request.url);
        const payStatementId = url.searchParams.get('paystatementid');
        
        if (payStatementId) {
            // payStatementId를 기반으로 리디렉션할 URL 생성
            const redirectUrl = `https://example.com/pay_statement_${payStatementId}`;
            
            // 리디렉션 응답 반환
            return NextResponse.redirect(redirectUrl);
        } else {
            return NextResponse.json({ error: 'Pay Statement ID is required' }, { status: 400 });
        }
    } catch (error) {
        console.error('리디렉션 요청 실패:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
