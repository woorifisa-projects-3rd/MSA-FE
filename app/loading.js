import React from 'react';
import Image from 'next/image';
import Spinner from '@/public/images/loading.gif';

export default function Loading() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '20%' }}>
            <Image unoptimized={true} src={Spinner} alt="로딩 중" width={100} height={100} />
        </div>
    )
}