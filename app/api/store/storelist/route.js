export const dynamic = 'force-dynamic'

import springClient from "@/lib/springClient";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        const response = await springClient.get('/user/store/storelist')
        // console.log("가게 리스트 조회 api response", response.data);
        
        if (!response || !response.data) {
            throw new Error('가게 리스트 데이터를 받아오지 못했습니다.');
        }

        return NextResponse.json(response.data, {status:200});
    } catch(error){
        return NextResponse.json(
            {error: error.response.data}
        )
    }
}