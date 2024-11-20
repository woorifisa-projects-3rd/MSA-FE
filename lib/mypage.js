import apiClient from "./nextClient";

export const mypageApi = {
    // 마이페이지 정보 조회
    getMyInfo : async () => {
        try{
            // const tokenResponse = await fetch('/api/auth/session');
            // const { accessToken } = await tokenResponse.json();

            // console.log('마이페이지 정보 요청 시작');
            // const response = await fetch('http://localhost:8888/user/president/mypage', {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //         'Content-Type': 'application/json'
            //     }
            // });

            const response = await fetch('/api/mypage');
            
            return await response.json();
        } catch (error) {
            console.error('상세 에러:', error.response?.data || error.message);
            throw error;
        }
    },

    // 마이페이지 정보 수정
    updateMyInfo: async (updateData) => {
        try {
            const response = await apiClient.put('/user/president/modify', updateData);
            return response.data; //axios는 .data 사용
        } catch (error) {
            throw error;
        }
    }
}