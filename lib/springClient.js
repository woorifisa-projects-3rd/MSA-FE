import axios from "axios";
import { cookies } from "next/headers";

const springClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,  
    withCredentials:true, //httpOnly 쿠키 처리 
    // timeout: 5000,
    headers:{
        'Content-Type':  'application/json',
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300; 
    }
    
});

// 쿠키에서 accessToken 가져오는 함수
const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];
  };
  

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


// 적용안됨
// springClient.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         console.log("리다이렉트 테스트")
//         console.error('인증 실패: 로그인 페이지로 리다이렉트');
//         window.location.href = '/login'; // 로그인 페이지로 이동
//       }
  
//       return Promise.reject(error);
//     }
//   );

export default springClient;