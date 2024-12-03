    'use client'
    import DefaultTable from '@/components/table/DefaultTable';
    import classes from './ProfileDetail.module.css';
    // import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
    import ModalContainer from '@/components/modal/modal-container';
    import { useState, useEffect, useRef } from 'react';
    import PrimaryButton from '@/components/button/primary-button';
    import DeleteConfirmModal from '@/components/modal/delete-confirm/delete-confirm';
    import PresidentInfo from './PresidentInfo';
    import { bankCodeList } from '@/constants/bankCodeList';
    import { nextClient } from '@/lib/nextClient';
    import FirstStoreRegistration from '@/components/modal/workplace-registration.js/FirstStoreRegistration';
    import AdditionalStoreRegistration from '@/components/modal/workplace-registration.js/AdditionalStoreRegistraion';
    import DeleteModal from '@/components/modal/delete-commute-modal/delete-commute-modal';


    const tableName = '보유하신 사업장';
    const tableHeaders = {
        storeName: '사업장 상호명',
        businessNumber: '사업자 번호',
        accountNumber: '계좌번호',
        edit: '편집',
        actions: '삭제',
    };

    const getBankLogo = (code) => {
        const bank = bankCodeList.find((bank) => bank.code === code);
        return bank ? bank.logoUrl : null;
    };

    export default function ProfileDetail({ content, refreshStores }) {
        const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
        const [isEditModalOpen, setEditModalOpen] = useState(false);
        const [isFirstRegistrationModalOpen, setFirstRegistrationModalOpen] = useState(false);
        const [selectedWorkplace, setSelectedWorkplace] = useState(null);
        const workplaceModalRef = useRef(null);
        const [error, setError] = useState('');
        const [deleteStoreId, setdeleteStoreId] = useState(null);
        const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

        const handleFormSubmit = () => {
            if (workplaceModalRef.current) {
                workplaceModalRef.current.handleSubmit();
            } else {
                console.error('workplaceModalRef 초기화되지 않음');
            }
        };

        const workplaceInfo = content;

        const handleDeleteClick = (workplace) => {            
            setdeleteStoreId(workplace.storeId);
            setDeleteModalOpen(true);
        }

        const handleDeleteConfirm = async () => {            
            if (!deleteStoreId) return;

            setDeleteModalOpen(true);
            try {
                const response = await nextClient.delete('/mypage/store', {
                    data: { storeid: deleteStoreId },
                });

                if (response.data.success) {
                    alert('가게가 삭제 되었습니다.');
                    
                } else {
                    throw new Error(response.data.error || '가게 삭제 실패');
                }
                setDeleteModalOpen(false);
                // refreshStores();
                window.location.reload();

            } catch (error) {
                setError(error.response?.data?.error || error.message);
            }
        };

        const enrichedWorkplaceInfo = workplaceInfo.map((workplace) => ({
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
            edit: (
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
                        handleDeleteClick(workplace);
                    }}
                />
            ),
        }));

        return (
            <div className={classes.container}>
                <div className={classes.otherComponent}>
                    <PresidentInfo />
                </div>

                {workplaceInfo.length > 0 ? (
                    <>
                        <DefaultTable
                            tableName={tableName}
                            tableHeaders={tableHeaders}
                            list={enrichedWorkplaceInfo}
                        />
                        <div className={classes.addButtonContainer}>
                            <button
                                onClick={() => setRegistrationModalOpen(true)}
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
                                <span className={classes.addButtonText}>사업장 추가등록</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={classes.addButtonContainer}>
                    <button
                        onClick={() => setFirstRegistrationModalOpen(true)}
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
                        <span className={classes.addButtonText}>사업장 최초 등록</span>
                    </button>
                </div>
                )}

                {/* 등록 모달 */}
                <ModalContainer
                    title="사업장 등록"
                    isOpen={isRegistrationModalOpen}
                    onClose={()=>setRegistrationModalOpen(false)}
                    onConfirm={handleFormSubmit}
                    showButtons={false}
                >
                    <AdditionalStoreRegistration />
                </ModalContainer>

                {/* 사업장 최초 등록 모달 */}
                <ModalContainer
                    title="사업장 등록"
                    isOpen={isFirstRegistrationModalOpen}
                    onClose={()=>setFirstRegistrationModalOpen(false)}
                    showButtons={false}
                >
                    <FirstStoreRegistration />
                </ModalContainer>

                {/* 사업장 수정 모달 - 12/3에 반영하겠음 */}
                <ModalContainer
                    title="사업장 수정"
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onConfirm={handleFormSubmit}
                >
                    {/* <WorkplaceModal
                        mode="edit"
                        workplaceData={selectedWorkplace}
                        ref={workplaceModalRef}
                        onSubmit={(formData) => {
                            setEditModalOpen(false);
                        }}
                    /> */}
                </ModalContainer>
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onDelete={handleDeleteConfirm}
                    deleteId={deleteStoreId}
                    title="가게 삭제"
                    text="해당 가게를 정말 삭제하시겠습니까?"
                />
            </div>
        );
    }
