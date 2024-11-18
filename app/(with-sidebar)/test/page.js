'use client';

import BaseButton from '@/components/button/base-button';
import PrimaryButton from '@/components/button/primary-button';

export default function TestPage() {
    return (
        <div>
            <h1>버튼 컴포넌트 예제</h1>
            <h1>primary button,base button 기본 모양 피그마에서 확인하기 </h1>
            <h3>button type은 submit(제출), button(그냥 버튼) 둘 중에 하나만. </h3>
            <h3>base button 사용 예제 - 기본 스타일 외에 원하는 스타일은 props로 css 문법 사용해서 전달하면 됨</h3>
            {/*  Base Button 예시 */}
            <div className='flex gap-5 mb-4'>
            {/* 기본 BaseButton */}
                <BaseButton 
                    text="Default BaseButton"
                    onClick={() => console.log('Clicked')}
                />

                {/* 배경색 변경 */}
                <BaseButton
                    text="Green BaseButton"
                    backgroundColor="#28a745"
                    color="#ffffff"
                    onClick={() => console.log('Green button clicked')}
                />

                {/* 크기 변경 */}
                <BaseButton
                    text="Large BaseButton"
                    width="200px"
                    height="50px"
                    onClick={() => console.log('Large button clicked')}
                />

                {/* 테두리 추가 */}
                <BaseButton
                    text="Outlined BaseButton"
                    border="1px solid #4B71F4"
                    borderRadius="8px"
                    onClick={() => console.log('Outlined button clicked')}
                />
            </div>

            <h3>primary button 사용 예제 - 기본 스타일 외에 원하는 스타일은 props로 css 문법 사용해서 전달하면 됨</h3>
            <div className='flex gap-5'>
                {/* 기본 PrimaryButton */}
                <PrimaryButton 
                    text="Default PrimaryButton"
                    onClick={() => console.log('Clicked')}
                />

                {/* 배경색 변경 */}
                <PrimaryButton
                    text="Green PrimaryButton"
                    backgroundColor="#28a745"
                    color="#ffffff"
                    onClick={() => console.log('Green button clicked')}
                />

                {/* 크기 변경 */}
                <PrimaryButton
                    text="Large PrimaryButton"
                    width="200px"
                    height="50px"
                    onClick={() => console.log('Large button clicked')}
                />

                {/* 테두리 변경 */}
                <PrimaryButton
                    text="Outlined PrimaryButton"
                    borderColor="#FF6B6B"
                    borderWidth="2px"
                    borderRadius="12px"
                    onClick={() => console.log('Outlined button clicked')}
                />
            </div>



        </div>
    );
}


