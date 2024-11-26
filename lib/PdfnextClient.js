import axios from "axios";

const PdfnextClient = axios.create({
    baseURL:'/api', // Next.js API Route 기본 경로
    headers: {
        'Content-Type': 'application/pdf',
        'Accept': 'application/pdf'
    },
})

export { PdfnextClient };

