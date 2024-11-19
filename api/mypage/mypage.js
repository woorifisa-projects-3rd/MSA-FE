import apiClient from "../config/axios";

export const mypageApi = {
    // 마이페이지 정보 조회
    getMyInfo : async () => {
        try{
            const response = await apiClient.get('/user/president/mypage');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 마이페이지 정보 수정
    updateMyInfo: async (updateData) => {
        try {
            const response = await apiClient.put('/user/president/modify', updateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}