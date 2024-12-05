import { NextResponse } from "next/server";
import springClient from "@/lib/springClient";

export async function PUT(request) {
    try{
        const { searchParams } = new URL(request.url);
        const storeid = searchParams.get('storeid');

        if (!storeid) {
            return NextResponse.json({ 
                success: false, 
                error: "가게 ID가 필요합니다." 
            }, { status: 400 });
        }

        const formData = await request.json();
        console.log("수정할 가게 정보:", formData);

        const response = await springClient.put(`/user/store?storeid=${storeid}`, formData);
        console.log('Spring Boot 에서 왔다.:', response.data);

        if(response.status){
            return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch(error) {
        console.log(error.response.data.message)
        const errorMessage = error.response.data.message // 확인테스트
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ 
            success: false,
            error: errorMessage 
        }, { 
            status: statusCode 
        }); 
    }
}