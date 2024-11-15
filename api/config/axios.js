import axios from "axios";
// 인터셉터 설정
// *인터셉터 설정 이유:
// 공통된 요청/응답 처리 로적일 한 곳에서 관리, 코드 중복 방지, 일관된 에러 처리, 인증 토큰 같은 공통 헤더를 자동으로 처리
// 일반 API용 인스턴스, 파일 업로드용 인스턴스, 외부 api용 인스턴스 다양하게 인스턴스 설정할 수 있음

// spring boot api 요청 처리를 위한 인스턴스 생성
const apiClient  = axios.create({
    // spring boot 서버 주소
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // 요청 타임아웃 설정 -> 추후 결정
    // 기본 헤더 설정
    headers:{
        'Content-Type':  'application/json',
         'Accept': 'application/json'
    }
});

// 요청 인터셉터 - 요청 보내기 전 수행 -> JWT 토큰 관리
apiClient.interceptors.response.use(
    (config) => {
        if(config.url === '/api/auth/login'){
            return config
        }

        // localstorage에서 토큰 가져오기
        const token = localStorage.getItem('token');

        // 토큰이 있다면 Authorization 헤더에 추가
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        } else {
             // 토큰이 없으면 로그인 페이지로 리다이렉트
             window.location.href = '/login';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 응답 인터셉터 - spring boot 서버의 응답 처리
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    // 응답에 대한 에러 핸들링 
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 400: // Bad Request
                    console.error('잘못된 요청입니다.');
                    break;
                    
                case 401: // 토큰이 유효하지 않거나 만료된 경우
                    localStorage.removeItem('token'); // 토큰 삭제
                    window.location.href = '/login';  // 로그인 페이지로 리다이렉트
                    break;
                    
                case 403: // Forbidden
                    console.error('권한이 없습니다.');
                    break;
                    
                case 404: // Not Found
                    console.error('요청한 리소스를 찾을 수 없습니다.');
                    break;
                    
                case 500: // Internal Server Error
                    console.error('서버 에러가 발생했습니다.');
                    break;
                    
                default:
                    console.error('알 수 없는 에러가 발생했습니다.');
                    break;
            }
        } else if (error.request) {
            // 요청은 보냈으나 응답을 받지 못한 경우
            console.error('서버로부터 응답이 없습니다.');
        } else {
            // 요청 설정 중 에러 발생
            console.error('요청 설정 중 에러가 발생했습니다:', error.message);
        }
        
        return Promise.reject(error);  // promise를 실패 상태로 바꾸는 함수
    }
)

// 추후 추가 예정 
// 특정 요청을 위한 axios 인스턴스 
// 특정 요청에만 적용되는 인터셉터
// 특정 응답에만 적용되는 인터셉터

export default apiClient;

