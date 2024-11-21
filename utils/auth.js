import { cookies } from "next/headers";

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

// 토큰 관련 로직 -> 토큰 삭제, 가져오기, 저장 


// 액세스 토큰 관련 함수들
export const setAccessToken = (token) => {
    cookies().set(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 60 * 2
    });
};
  
export const getAccessToken = () => {
    return cookies().get(ACCESS_TOKEN)?.value || null;
};


export const deleteAccessToken = () => {
    cookies().delete(ACCESS_TOKEN);
};


// 리프레시 토큰 관련 함수들
export const setRefreshToken = (token) => {
    cookies().set(REFRESH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
}

export const getRefreshToken = () => {
    return cookies().get(REFRESH_TOKEN)?.value || null;
};

export const deleteRefreshToken = () => {
    cookies().delete(REFRESH_TOKEN);
};