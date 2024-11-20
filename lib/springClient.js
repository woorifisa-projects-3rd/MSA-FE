import axios from "axios";
import { cookies } from "next/headers";

const springClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    withCredentials:true, //httpOnly 쿠키 처리 
    headers:{
        'Content-Type':  'application/json',
    },
    validateStatus: function (status) {
        return status >= 200 && status < 500; 
    }
});


springClient.interceptors.request.use((config) => {
    // 로그인 경로에서는 Authorization 헤더 설정하지 않음
    if (!config.url.includes('/user/president/login')
        ||!config.url.includes('/attendance/go-to-work')
        ||!config.url.includes('/attendance/leave-work')) {
        const token = cookies().get('accessToken')?.value;
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});


export default springClient;