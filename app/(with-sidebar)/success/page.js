// app/success/page.js
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import styles from "./page.module.css";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type'); // 'register' or 'edit'
    const storeName = searchParams.get('storeName');

    return (
        <div className={styles.containerBox}>
            <div className={styles.container}>
                 {/* SVG 애니메이션 */}
                <div className={styles.animationContainer}>
                    {/* <svg className={styles.checkmark} viewBox="0 0 52 52">
                        <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                        <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg> */}
                    <svg className={styles.checkmark} viewBox="0 0 52 52">
                        <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none" stroke="#00D36D" stroke-width="1"/>
                        <path className={styles.checkmarkCheck} fill="none" stroke="#00D36D" stroke-width="5" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                {/* 성공 메시지 */}
                <h1 className={styles.title}>
                    {type === 'register' ? '사업장 등록 완료!' : '사업장 수정 완료!'}
                </h1>
                <p className={styles.message}>
                    <span className={styles.storeName}>{storeName}</span>
                    {type === 'register' 
                        ? '이(가) 성공적으로 등록되었습니다.' 
                        : '의 정보가 성공적으로 수정되었습니다.'}
                </p>

                {/* 버튼 */}
                <button 
                    onClick={() => router.push('/mypage')}
                    className={styles.button}
                >
                    마이페이지로 돌아가기
                </button>
            </div>
           
        </div>
    );
}