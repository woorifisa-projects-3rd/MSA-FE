import springClient from "@/lib/springClient";
import { NextResponse } from "next/server";

export async function GET(request){
    try{
        const response = await springClient.get('/user/store/storelist')
        console.log("가게 리스트 조회 api response", response.data);

        return NextResponse.json(response.data, {status:200});
    } catch(error){
        return NextResponse.json(
            {error: error.response.data}
        )
    }
}