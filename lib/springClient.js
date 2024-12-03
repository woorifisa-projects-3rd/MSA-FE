import axios from "axios";
import { cookies } from "next/headers";
import { nextClient } from "./nextClient";

const springClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    withCredentials:true, //httpOnly 쿠키 처리 
    timeout: 5000,
    headers:{
        'Content-Type':  'application/json',
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300; 
    }
    
});


springClient.interceptors.request.use((config) => {
    // 로그인 경로에서는 Authorization 헤더 설정하지 않음
    if (!config.url.includes('/user/president/login')
       ) {
        const token = cookies().get('accessToken')?.value;
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// 응답 인터셉터(refresh 관련 추가로직) -> 나중에 적용 
// springClient.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;
  
//       // access token 만료로 인한 502 에러이고, 재시도하지 않은 요청인 경우
//       if (error.response.status === 502 && !originalRequest._retry) {
//         originalRequest._retry = true;
  
//         try {
//           // Next.js API를 통해 리프레시 토큰으로 새 액세스 토큰 요청
//           await nextClient.get('/auth/refresh');

        
//           // 쿠키에서 새로운 액세스 토큰을 가져와 헤더에 추가
//           const newAccessToken = cookies().get('accessToken')?.value;

//           if (!newAccessToken) {
//             throw new Error('액세스 토큰 갱신 실패');
//           }

//           // 새로운 액세스 토큰을 원래 요청 헤더에 명시적으로 추가
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//           // 새로운 액세스 토큰으로 원래 요청 재시도
//           return springClient(originalRequest);
//         } catch (refreshError) {
//           // 리프레시 토큰도 만료된 경우 로그인 페이지로 리다이렉트
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       }
  
//       return Promise.reject(error);
//     }
//   );


export default springClient;