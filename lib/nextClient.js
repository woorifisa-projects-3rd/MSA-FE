import axios from "axios";

const nextClient = axios.create({
    baseURL:'/api', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
})

// // 요청 인터셉터 추가 -> 굳이 필요없어보임 
// nextClient.interceptors.request.use(
//     (config) => {
//         console.log('[Request Config]:', {
//             url: config.url,
//             method: config.method,
//             data: config.data,
//             params: config.params
//         });
//         return config;
//     },
//     (error) => {
//         console.error('[Request Error]:', error);
//         return Promise.reject(error);
//     }
// );

export {nextClient };

const AbsolutePathClient = axios.create({
    baseURL:'http://localhost:3000/api/', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
})

export {AbsolutePathClient };


