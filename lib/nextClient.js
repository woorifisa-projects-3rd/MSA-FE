import axios from "axios";
// 인터셉터 설정

// axios 인스턴스 생성
// const springClient  = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,  
//     withCredentials:true, //httpOnly 쿠키 처리 
//     headers:{
//         'Content-Type':  'application/json',
//         'Accept': 'application/json',
//     }
// });

// 요청 인터셉터 : 공통 헤더 설정 
// springClient.interceptors.request.use((config) => {
//     const token = getAccessToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

const nextClient = axios.create({
    baseURL:'api', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
})

export {nextClient };

