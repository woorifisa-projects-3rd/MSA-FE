import apiClient from "../config/axios";

// 개발 환경에서 토큰 있다고 가정
if(process.env.NODE_ENV === "development"){
    const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;
    if(devToken){
        localStorage.setItem('token', devToken)
    }
}



export const authApi = {
    // 로그인
    login: async (username, password) => {
        try{
            const response = await apiClient.post('/user/president/login', {
                email,
                password
            });

            // 로그인 성공시 JWT 토큰을 localstorage 에 저장
            const {accessToken} = response.data;

            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // 로그아웃
    logout: async () => {
        try {
            // withCredentials가 true이므로 쿠키가 자동으로 포함됨
            const response = await apiClient.get('/user/president/logout', {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEV_TOKEN}`
                }
            });
            // 로그아웃 성공 시 쿠키 삭제는 서버에서 처리됨
            // 로그아웃 성공 후 리다이렉트
            if (response.status === 200) {
                window.location.href = '/login';
            }
        } catch (error) {
            throw error;
        }
    },

    // 토큰 유효성 검사(나중에 수정)
    validateToken: async () => {
        try {
            const response = await apiClient.get('/api/auth/validate');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            throw error;
        }
    },

    // ID 찾기 함수
    findId: async (name, phoneNumber) => {
        try {
            const response = await apiClient.post('/user/president/id-find', {
                name,
                phone_number: phoneNumber
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};