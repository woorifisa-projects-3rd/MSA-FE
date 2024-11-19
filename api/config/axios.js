import axios from "axios";
// 인터셉터 설정

// spring boot api 요청 처리를 위한 인스턴스 생성
const apiClient  = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,   // spring boot 서버 주소
    withCredentials:true,
    headers:{
        'Content-Type':  'application/json',
         'Accept': 'application/json',
    }
});


export default apiClient;

