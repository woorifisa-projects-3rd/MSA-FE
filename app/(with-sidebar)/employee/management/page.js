'use client';

import { useEffect, useState } from 'react';
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import BaseButton from '@/components/button/base-button';
import { employeeApi } from '@/api/employee/employee'; // API 호출 함수

const edit = "수정";
const del = "삭제";

export default function SalesExpenses() {
    const tableHeaders = {
        name: "직원 이름",
        phoneNumber: "전화번호",
        birthDate: "생년월일",
        address: "주소",
        edit: "수정",
        delete: "삭제"
    }; //다른 sex,salary, accountNumber 등도 받아는 오지만 Headers에서만 쓰지 않고, EmployeeList에 있어서

    const [employeeList, setEmployeeList] = useState([]);

    // 직원 목록을 가져오는 함수
    const fetchEmployeeList = async () => {
        try {
            const storeId = 5; //여기에 가지고 있는 값 넣어야됨
            const data = await employeeApi.getEmployeeDetails(storeId);
            setEmployeeList(data); // 가져온 데이터를 상태에 저장
        } catch (error) {
            console.error('직원 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 직원 목록을 가져오기
    useEffect(() => {
        fetchEmployeeList();
    }, []);

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>직원 정보 조회/수정 페이지</h1>
        
            <BaseButton text="직원 추가" />
            
            <DefaultTable 
                tableName="직원정보 관리" 
                tableHeaders={tableHeaders} 
                list={employeeList} // API로부터 받은 employeeList 전달
            />
        </div>
    );
}
