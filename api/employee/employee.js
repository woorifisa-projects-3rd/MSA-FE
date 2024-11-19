import apiClient from "../config/axios";

export const employeeApi = {

    // 직원 정보 조회
    getEmployeeDetails: async (storeId) => {
        try {
            // 세션에서 토큰을 받아옴 (서버 또는 클라이언트에서)
            const tokenResponse = await fetch('/api/auth/session');
            const { accessToken } = await tokenResponse.json();

            // 요청에 Authorization 헤더 추가
            const response = await apiClient.get(`/user/employee/details?storeid=${storeId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status !== 200) {
                throw new Error(`직원 정보를 가져오는데 실패했습니다: ${response.status}`);
            }

            return response.data;

        } catch (error) {
            console.error('상세 에러:', error.message);
            throw error;
        }
    },
};
