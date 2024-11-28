import React from 'react';
import Image from 'next/image';
import Spinner from '@/public/images/loading.gif';

const Loading = () => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}>
            <Image src={Spinner} alt="로딩 중" width={100} height={100} />
        </div>
    );
};

export default Loading;
