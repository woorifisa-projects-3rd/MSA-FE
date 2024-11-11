'use client';

import { useState } from 'react';
import classes from "./page.module.css";
import ModalContainer from '@/components/modal/modal-container';
import WorkplaceModal from '@/components/modal/workplace-registraion/workplace-registration';

export default function SalesExpenses() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>금융 상품 추천 페이지</h1>
            <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
            <ModalContainer
                isOpen={isModalOpen}
                onClose={()=>setIsModalOpen(false)}
                title="사업장 등록"
            >
               {/* 여기메 모달  content 넣기  */}
               <WorkplaceModal />
            </ModalContainer>
        </div>
    );
}