import { NextResponse } from "next/server";
import springClient from "@/lib/springClient";

export async function POST(request) {
    try{
        const {pinNumber} = await request.json();
        console.log("addtitional pincheck",{pinNumber})
        
        const response = await springClient.post('/user/core/account/certificate/pin', { pinNumber });
        console.log('Spring Boot 에서 왔다.:', response.data);

        if(response.data){
            return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch(error) {
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