"use client"
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import ModalContainer from '@/components/modal/modal-container';
import PrimaryButton from '@/components/button/primary-button';
import BaseButton from '@/components/button/base-button';
import EmployeeForm from '@/components/modal/employee-add/employee-add'
import { useState, useRef } from 'react';

const edit = "수정";
const del = "삭제";

export default function SalesExpenses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 선택된 직원 데이터
    const employeeFormRef = useRef(null);

    // 모달 열기
    const openModal = (mode = "add", employee = null) => {
        setIsEditMode(mode === "edit");
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    }

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedEmployee(null);
    }

    const handleFormSubmit = () => {
        if (employeeFormRef.current) {
            employeeFormRef.current.handleSubmit();
        }
    }


    const tableHeaders = {
        name: "직원 이름",
        phoneNumber: "전화번호",
        birthDate: "생년월일",
        address: "주소",
        edit: "수정",
        delete: "삭제"
    };

    const list = [
        {
            name: "정성윤",
            phoneNumber: "(225) 555-0118",
            birthDate: "2000-06-20",
            address: "서울 반포 반포자이",
            email: "apple@gmail.com",
            sex: true,
            employmentType: true,
            bankCode: '001',
            accountNumber: '123-456-789012',
            salary: 10000,
            paymentDate: 15,
            postcodeAddress: '서울시 반포구',
            detailAddress: '래미안 11동 306호'
        },
        {
            name: "이현아",
            phoneNumber: "(225) 555-0118",
            birthDate: "2000-06-20",
            address: "성수동 트리마제",
            email: "apple@gmail.com",
            sex: false,
            employmentType: false,
            bankCode: '001',
            accountNumber: '123-456-789012',
            salary: 3000000,
            paymentDate: 15
        },
        {
            name: "류혜리",
            phoneNumber: "(225) 555-0118",
            birthDate: "2000-06-20",
            address: "한남동 나인원한남",
            email: "apple@gmail.com"
        },
        {
            name: "임지혁",
            phoneNumber: "(225) 555-0118",
            birthDate: "2000-06-20",
            address: "두꺼비집",
            email: "apple@gmail.com"
        },
        {
            name: "박준현",
            phoneNumber: "(823) 555-0129",
            birthDate: "2000-06-20",
            address: "소나무 까치집",
            email: "apple@gmail.com"
        },
        {
            name: "강세필",
            phoneNumber: "(225) 555-0118",
            birthDate: "2000-06-20",
            address: "홍대 개미집",
            email: "apple@gmail.com"
            
        }
    ];

    // 편집 버튼 클릭 시
    const handleEditClick = (employee) => {
        openModal("edit", employee);
    };

    const enrichedList = list.map(employee => ({
        ...employee,
        edit: (
            <PrimaryButton
                text="수정"
                onClick={() => handleEditClick(employee)}
            />
        ),
        delete: (
            <PrimaryButton
                text="삭제"
                onClick={() => handleDeleteClick(employee)}
            />
        )
    }));


    return (
        <div className={classes.container}>
            <h1 className={classes.title}>직원 정보 조회/수정 페이지</h1>
        
            <BaseButton text= "직원 추가" onClick={() => openModal("add")}/>
            <DefaultTable tableName="직원정보 관리" tableHeaders={tableHeaders} list={enrichedList} />
            {isModalOpen && (
                <ModalContainer
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    confirmText={isEditMode ? "직원 수정하기" : "직원 등록하기"}
                    onConfirm={handleFormSubmit}
                >
                    <EmployeeForm
                        mode={isEditMode ? "edit" : "add"}
                        initialData={selectedEmployee}
                        onSubmit={data => {
                            console.log("Form Submitted: ", data);
                            closeModal();                
                        }}
                        ref={employeeFormRef}
                         />
                </ModalContainer>
            )}
        </div>
    );
}