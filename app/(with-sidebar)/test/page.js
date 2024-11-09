import React from 'react';
import Button from '@/components/button/button';

export default function TestPage() {
    return (
        <div>
            <h1>버튼 컴포넌트 예제</h1>
            {/* 확인 버튼 (submit) */}
            <Button type="submit" text="확인" size="large" />

            {/* 취소 버튼 (cancel) */}
            <Button type="cancel" text="취소" size="large" />

            {/* 파란 테두리 버튼 (outline) */}
            <Button type="outline" text="인증" size="medium" />
           
            {/* 파란 테두리 버튼 (outline) */}
            <Button type="outline" text="우편번호 찾기" size="medium" />

            {/* 커스텀 버튼 */}
            <Button
                type="custom"
                text="커스텀 버튼"
                color="#28a745"
                textColor="#ffffff"
                size="small"
            />
        </div>
    );
}
