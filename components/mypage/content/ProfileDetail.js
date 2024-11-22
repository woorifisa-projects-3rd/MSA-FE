// PageProfileDetail.js
'use client'
import DefaultTable from '@/components/table/DefaultTable';
import classes from './ProfileDetail.module.css';
import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
import ModalContainer from '@/components/modal/modal-container';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/components/button/primary-button';
import DeleteConfirmModal from '@/components/modal/delete-confirm/delete-confirm';
import PresidentInfo from './PresidentInfo';
import { bankCodeList } from '@/constants/bankCodeList';


//테스트 데이터
const tableName='보유하신 사업장'
const tableHeaders = {
    storeName: "사업장 상호명",
    businessNumber: "사업자 번호",
    accountNumber: "계좌번호",
    edit: "편집",
    actions: "삭제"
};

const getBankLogo = (code) => {
    const bank = bankCodeList.find(bank => bank.code === code);
    return bank ? bank.logoUrl : null;
};

export default function ProfileDetail({content}) {
    const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState(null);
    const workplaceModalRef = useRef(null);

    const handleFormSubmit = () => {
        if (workplaceModalRef.current) {
            // console.log("handleSubmit 호출 준비 완료");
            workplaceModalRef.current.handleSubmit();
          } else {
            console.error("workplaceModalRef 초기화되지 않음");
          }
    }

    const workplaceInfo = content; // 사업장 정보(버튼 미포함)

    const enrichedWorkplaceInfo = workplaceInfo.map(workplace =>({
        ...workplace,
        accountNumber: (
            <div className={classes.accountContainer}>
                {workplace.bankCode && (
                    <span
                        className={classes.bankLogo}
                        style={{
                            backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(getBankLogo(workplace.bankCode))}')`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                        }}
                    ></span>
                )}
                <span>{workplace.accountNumber}</span>
            </div>
        ),
        // edit와 actions에 대한 컴포넌트를 직접 할당
        edit:(
            <PrimaryButton
                text="편집"
                onClick={() => {
                    setSelectedWorkplace(workplace);
                    setEditModalOpen(true);
                }}
            />
        ),
        actions: (
            <PrimaryButton
                text="삭제"
                onClick={() => {
                    setSelectedWorkplace(workplace);
                    setDeleteModalOpen(true);
                }}
            />
        )

    }))
   
   return (
       <div className={classes.container}>
        
           <div className={classes.otherComponent}>
                <PresidentInfo />
                
            </div>

           <DefaultTable tableName={tableName} tableHeaders={tableHeaders} list={enrichedWorkplaceInfo}/>

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

            {/* 등록 모달 */}
            <ModalContainer
                title="사업장 등록"
                isOpen={isRegistrationModalOpen}
                onClose={()=>setRegistrationModalOpen(false)}
                onConfirm={handleFormSubmit}
            >
                <WorkplaceModal
                    ref={workplaceModalRef}
                    onSubmit={(formData) => {
                        setRegistrationModalOpen(false);
                    }}
                />
            </ModalContainer>

            {/* 편집 모달 */}
            <ModalContainer
                title="사업장 수정"
                isOpen={isEditModalOpen}
                onClose={()=>setEditModalOpen(false)}
                onConfirm={handleFormSubmit}
            >
                <WorkplaceModal
                    mode='edit'
                    workplaceData={selectedWorkplace}
                    ref={workplaceModalRef}
                    onSubmit={(formData) => {
                        setEditModalOpen(false);
                    }}
                    />
            </ModalContainer>

            {/* 삭제 모달 추가  */}
            <ModalContainer
                isOpen={isDeleteModalOpen}
                onClose={()=>setDeleteModalOpen(false)}
                onConfirm={()=>console.log("삭제 !!!")}
            >
                <DeleteConfirmModal/>
            </ModalContainer>

       </div>
   );
}

