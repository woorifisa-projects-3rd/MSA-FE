'use client'
import DefaultTable from '@/components/table/DefaultTable';
// import classes from './ProfileDetail.module.css';
import classes from './Workplace.module.css';
// import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
import ModalContainer from '@/components/modal/modal-container';
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/components/button/primary-button';
import { bankCodeList } from '@/constants/bankCodeList';
import { nextClient } from '@/lib/nextClient';
import FirstStoreRegistration from '@/components/modal/workplace-registration.js/FirstStoreRegistration';
import AdditionalStoreRegistration from '@/components/modal/workplace-registration.js/AdditionalStoreRegistraion';
import DeleteModal from '@/components/modal/delete-commute-modal/delete-commute-modal';
import EditStoreRegistration from '@/components/modal/workplace-registration.js/EditStoreRegistration';

const tableName = "보유 사업장";
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

export default function Workplace() {
    const [stores, setStores] = useState([]);
    const [originalStore, setOriginalStore] = useState([]);
    const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isFirstRegistrationModalOpen, setFirstRegistrationModalOpen] = useState(false);
    const [selectedWorkplace, setSelectedWorkplace] = useState(null);
    const [error, setError] = useState('');
    const [deleteStoreId, setdeleteStoreId] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchStores = async () => {
    
        setLoading(true);
        setError(null);
        try {
            const response = await nextClient.get('/mypage/store/storelist');
            console.log("매출/재출 데이터",response.data) // businessNumber 있음 
            setOriginalStore(response.data);
            const transformedStores = response.data.map(store => ({
                storeId: store.id,
                storeName: store.storeName,
                businessNumber: store.businessNumber,
                accountNumber: store.accountNumber,
                bankCode: store.bankCode,
                location: store.location,
            }));
            console.log("transformedStores:", transformedStores); // businessNumber undefined 
            setStores(transformedStores); 
        } catch (error) {
            console.error("가게 데이터를 가져오는데 실패했습니다.");
            setError(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStores();
    }, []);


    const handleEditClick = (storeId) => {
        const store = originalStore.find((item) => item.id === storeId);
        if (store) {
            console.log("수정시 전달할 store:", store);
            setSelectedWorkplace(store); // 원본 데이터를 전달
            setEditModalOpen(true);
        }
    };
    
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

    console.log("stores", stores);

    console.log("selectedWorkplace", selectedWorkplace);
    const enrichedWorkplaceInfo = stores.map((workplace) => ({
     
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
                    handleEditClick(workplace.storeId)
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

            {stores.length > 0 ? (
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
                    <div className={classes.noStoreText}>
                        등록된 사업장이 없습니다.                       
                    </div>
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <span className={classes.addButtonText}>사업장 최초 등록</span>
                    </button>
                </div>
            )}

            {/* 사업장 최초 등록 모달 */}
            <ModalContainer
                title="사업장 등록"
                isOpen={isFirstRegistrationModalOpen}
                showButtons={false}
                onClose={()=>setFirstRegistrationModalOpen(false)} 
            >
                <FirstStoreRegistration 
                    onClose={()=>setFirstRegistrationModalOpen(false)} 
                    onSuccess={fetchStores}
                />
            </ModalContainer>

              {/* 사업장 추가 등록 모달 */}
              <ModalContainer
                title="사업장 등록"
                isOpen={isRegistrationModalOpen}
                onClose={()=>setRegistrationModalOpen(false)}
                showButtons={false}
            >
                <AdditionalStoreRegistration 
                    onClose={()=>setFirstRegistrationModalOpen(false)} 
                    onSuccess={fetchStores}
                />
            </ModalContainer>

            {/* 사업장 수정 모달*/}
            <ModalContainer
                    title="사업장 수정"
                    isOpen={isEditModalOpen}
                    showButtons={false}
                    onClose={() => setEditModalOpen(false)}
            >
                <EditStoreRegistration
                    onClose={()=>setEditModalOpen(false)} 
                    onSuccess={fetchStores}
                    initialData={selectedWorkplace}
                />
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
