import { cookies } from "next/headers";

export const ACCESS_TOKEN = 'accessToken';

// 토큰 관련 로직 -> 토큰 삭제, 가져오기, 저장 

export const setAccessToken = (token) => {
    cookies().set(ACCESS_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1시간
    });
};
  
export const getAccessToken = () => {
    return cookies().get(ACCESS_TOKEN)?.value || null;
};


export const deleteAccessToken = () => {
    cookies().delete(ACCESS_TOKEN);
};