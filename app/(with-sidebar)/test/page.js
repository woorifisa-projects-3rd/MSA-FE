import React from 'react';
import Button from '@/components/button/button';

export default function TestPage() {
    return (
        <div>
            <h1>버튼 컴포넌트 예제</h1>
            {/* 확인 버튼 (submit) */}
            <Button type="submit" size="xlarge" text="확인"  />

            {/* 취소 버튼 (cancel) */}
            <Button type="cancel" width="300px" height="500px" text="취소" />

            {/* 파란 테두리 버튼 (outline) */}
            <Button type="outline" text="인증"  />
           
            {/* 파란 테두리 버튼 (outline) */}
            <Button type="outline" text="우편번호 찾기" />

            {/* 커스텀 버튼 */}
            <Button
                type="custom"
                text="커스텀 버튼"
                color="#28a745"
                textColor="#ffffff"
                width="274px"
                heigh="44px"
            />
        </div>
    );
}


//width = "500.16px"
//heigh "61.55px"

// width="274px"
// heigh="44px"

// width="75px"
// heigh="30px"

//width= "119.33px"
// heigh="35.75px"
