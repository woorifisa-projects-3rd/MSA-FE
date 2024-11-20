import axios from "axios";

const nextClient = axios.create({
    baseURL:'/api', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/json',
    },
})

export {nextClient };

