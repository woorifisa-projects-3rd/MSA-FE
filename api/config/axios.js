import axios from "axios";
// 인터셉터 설정
// *인터셉터 설정 이유:
// 공통된 요청/응답 처리 로적일 한 곳에서 관리, 코드 중복 방지, 일관된 에러 처리, 인증 토큰 같은 공통 헤더를 자동으로 처리
// 일반 API용 인스턴스, 파일 업로드용 인스턴스, 외부 api용 인스턴스 다양하게 인스턴스 설정할 수 있음

// spring boot api 요청 처리를 위한 인스턴스 생성
const apiClient  = axios.create({
    // spring boot 서버 주소
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // 쿠키를 주고받기 위한 설정, 쿠키 전송을 위해 필요
    withCredentials:true,
    // 기본 헤더 설정
    headers:{
        'Content-Type':  'application/json',
         'Accept': 'application/json',
         
    }
});

// 요청 인터셉터 - 요청 보내기 전 수행 
// 요청 전 JWT 토큰을 가지고 있는지 매번 확인!
apiClient.interceptors.request.use(
    (config) => {
        // ID 찾기, 로그인 등 인증이 필요 없는 경로들
        const publicPaths = ['/user/president/id-find', '/user/president/login'];
        // 인증이 필요없는 경로라면 토큰 검사 없이 진행
        if(publicPaths.includes(config.url)){
            return config
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 응답 인터셉터 추가예정


// 추후 추가 예정 
// 특정 요청을 위한 axios 인스턴스 
// 특정 요청에만 적용되는 인터셉터
// 특정 응답에만 적용되는 인터셉터

export default apiClient;

