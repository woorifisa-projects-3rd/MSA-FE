import React from 'react';
import Image from 'next/image';
import Spinner from '@/public/images/loading.gif';

const Loading = () => {
    return (
        <div style={{
            position: 'absolute', // 부모 요소 기준 위치 설정
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image src={Spinner} alt="로딩 중" width={100} height={100} />
        </div>
    );
};

export default Loading;
