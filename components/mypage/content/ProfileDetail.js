// PageProfileDetail.js
'use client'
import DefaultTable from '@/components/table/DefaultTable';
import classes from './ProfileDetail.module.css';
import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
import ModalContainer from '@/components/modal/modal-container';
import { useState } from 'react';

export default function ProfileDetail({content}) {
    const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const name =content.name;
    const email =content.email;
    const workplaceInfo =content.workplaceInfo;
    
   return (
       <div className={classes.container}>
           <div className={classes.headerSection}>
               <h2 className={classes.title}>{name} 사장님</h2>
               <div className={classes.email}>{email}</div>
           </div>
                
            {/* 다른 컴포넌트 적용해야함 */}
           <div className={classes.otherComponent}>여기는 다른 컴포넌트</div>

           <DefaultTable tableName={tableName} tableHeaders={tableHeaders} list={workplaceInfo}/>

            <div className={classes.addButtonContainer}>
                   <button 
                    onClick={()=>setRegistrationModalOpen(true)}
                    className={classes.addButton}
                   >
                       <div className={classes.iconContainer}>
                           <svg 
                               className={classes.icon}
                               fill="none" 
                               stroke="currentColor" 
                               viewBox="0 0 24 24"
                           >
                               <path 
                                   strokeLinecap="round" 
                                   strokeLinejoin="round" 
                                   strokeWidth="2" 
                                   d="M19 14l-7 7m0 0l-7-7m7 7V3"
                               />
                           </svg>
                       </div>
                       <span className={classes.addButtonText}>사업장 추가 및 등록</span>
                   </button>
            </div>

            <ModalContainer
                title="사업장 등록"
                isOpen={isRegistrationModalOpen}
                onClose={()=>setRegistrationModalOpen(false)}
                onConfirm={()=>console.log("submit 완료")}
            >
                <WorkplaceModal />
            </ModalContainer>
       </div>
   );
}

//테스트 데이터
const tableName='보유하신 사업장'
const tableHeaders = {
    storeName: "사업장 상호명",
    businessNumber: "사업자 번호",
    accountNumber: "계좌번호",
    count: "직원 수",
    edit: "편집",
    actions: "삭제"
};