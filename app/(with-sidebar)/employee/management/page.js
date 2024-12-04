"use client"
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import ModalContainer from '@/components/modal/modal-container';
import PrimaryButton from '@/components/button/primary-button';
import BaseButton from '@/components/button/base-button';
import EmployeeForm from '@/components/modal/employee-add/employee-add'
import { useState, useEffect, useRef } from 'react';
import { nextClient } from "@/lib/nextClient";
import { useAuth } from "@/contexts/AuthProvider";
import NameSearch from "@/components/namesearch/name-search";
import DeleteModal from "@/components/modal/delete-commute-modal/delete-commute-modal";

const edit = "수정";
const del = "삭제";

export default function SalesExpenses() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // 선택된 직원 데이터
    const [employees, setEmployees] = useState([]); // 직원 리스트
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);
    const [deleteEmployeeId, setdeleteEmployeeId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const employeeFormRef = useRef(null);
    
    const {storeId} = useAuth();
    console.log("storeId?",storeId)

    const fetchEmployees = async () => {
        console.log("직원 리스트 요청")
        setLoading(true);
        setError(null);
        try {
            const response = await nextClient.get(`/employee/details?storeid=${storeId}`);
            console.log(response.data)
            setEmployees(response.data);
        } catch (error) {
            console.error("직원 데이터를 가져오는데 실패했습니다.", error);
            setEmployees([]);
            setError(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(storeId) {
            fetchEmployees();
        }
    }, [storeId]); // storeId가 변경될 때마다 직원 데이터 갱신

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

    const handleFormSubmit = async () => {
        if (employeeFormRef.current) {
            await employeeFormRef.current.handleSubmit();
            fetchEmployees(); // 직원 리스트 갱신
        }
    }

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const tableHeaders = {
        name: "직원 이름",
        phoneNumber: "전화번호",
        birthDate: "생년월일",
        address: "주소",
        edit: "수정",
        delete: "삭제"
    };

    // 편집 버튼 클릭 시
    const handleEditClick = (employee) => {
        openModal("edit", employee);
    };

    // 삭제 버튼 클릭 시
    const handleDeleteClick = (employee) => {
        setdeleteEmployeeId(employee.id);
        setDeleteModalOpen(true);
    }

    const handleDeleteConfirm = async () => {
        if (!deleteEmployeeId) return;

        setDeleteModalOpen(true);
        try {
            const response = await nextClient.delete('/employee', {
                data: {seid: deleteEmployeeId },
            });
            if (response.data.success) {
                alert('직원이 삭제되었습니다.');
                fetchEmployees();
            }
            setDeleteModalOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setDeleteModalOpen(false);
            setdeleteEmployeeId(null);
        }
    }

        // 전화번호 형식 변환 함수
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const cleaned = phoneNumber.replace(/\D/g, ""); // 숫자만 남기기
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : phoneNumber;
    };

    const filteredEmployees = Object.values(employees).filter(employee =>
        employee.name.includes(searchQuery) && employee.employmentType !== 10 && employee.employmentType !== 11
    );

    const enrichedList = filteredEmployees.map(employee => ({
        ...employee,
        phoneNumber: formatPhoneNumber(employee.phoneNumber), // 전화번호 포맷 적용
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
            <div className={classes.employeeHeader}>
                <h1 className={classes.title}>직원 정보 관리</h1>
                <div className={classes.titleRight}>
                <NameSearch onChange={handleSearchChange} placeholder="이름으로 검색"/>
                <BaseButton text= "직원 추가" onClick={() => openModal("add")}/>
                </div>
            </div>
            <DefaultTable tableHeaders={tableHeaders} list={enrichedList} />
        
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
                            console.log("제출된 데이터: ", data);
                            closeModal();
                        }}
                        ref={employeeFormRef}
                    />
                </ModalContainer>
            )}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteConfirm}
          deleteId={deleteEmployeeId}
          title="직원 삭제"
          text="해당 직원을 정말 삭제하시겠습니까?"
        />
        </div>
    );
}