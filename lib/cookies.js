import { cookies } from "next/headers";

export const getAccessToken = () => {
    const token = cookies().get('accessToken')?.value;
    return token || null;
};