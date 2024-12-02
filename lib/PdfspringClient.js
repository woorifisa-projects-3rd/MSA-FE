import axios from "axios";
import { cookies } from "next/headers";

const PdfspringClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    withCredentials:true, //httpOnly 쿠키 처리 
    headers:{
        'Content-Type':  'application/pdf',
        'Accept': 'application/pdf'
    }
});


PdfspringClient.interceptors.request.use((config) => {
    // 로그인 경로에서는 Authorization 헤더 설정하지 않음
    if (!config.url.includes('/user/president/login')) {
        const token = cookies().get('accessToken')?.value;
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});


export default PdfspringClient;