import axios from "axios";
import { cookies } from "next/headers";
// 인터셉터 설정

// axios 인스턴스 생성
const apiClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    withCredentials:true, //httpOnly 쿠키 처리 
    headers:{
        'Content-Type':  'application/json',
        'Accept': 'application/json',
    }
});

// 요청 인터셉터 : 공통 헤더 설정 
apiClient.interceptors.request.use((config) => {
    // 쿠키에서 accessToken을 가져와 헤더 추가 
    const token = cookies().get('accessToken')?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// 클라이언트에서 Next.js API Route로 요청하는 Axios 인스턴스
const apiRouteClient = axios.create({
    baseURL:'api', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClient ;


