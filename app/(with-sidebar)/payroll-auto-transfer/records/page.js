'use client';

import Button from "@/components/button/button";
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import MonthSelector from "@/components/selector/selector";
import React, { useEffect, useState } from 'react';
import NameSearch from "@/components/namesearch/name-search";
import Sorting from "@/components/sorting/sorting";
import { nextClient } from '@/lib/nextClient';
import BaseButton from "@/components/button/base-button";
import { bankCodeList } from "@/constants/bankCodeList";


export default function PayRecords() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sortOption, setSortOption] = useState('latest'); // 최신순 디폴트
    const [searchQuery, setSearchQuery] = useState('');
    const [list, setList] = useState([]);

    useEffect(() => {
        const loadPayStatementPageData = async () => {
          try {
            const response = await nextClient.get('/attendance/paystatement/employees');
            // console.log(response);
            const data = response.data.data;
            console.log(data)
    
            const formattedData = data.map(item => ({
                name: item.name,
                account: item.accountNumber,
                amount: item.amount,
                date: item.issuanceDate,
                button: <BaseButton text={buttonText} />
            }));

            setList(formattedData);
    
          } catch (error) {
            console.error('마이페이지 정보 로드 에러:', error.message);
          }
        }
    
        loadPayStatementPageData();
      }, []);


    const handleMonthChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // const [list, setList] = useState([
    //     { name: '정성윤', account: '110-123456-45687', amount: '266,000원', date: '2024/10/03', button: <BaseButton text={buttonText}  /> },
    //     { name: '이현아', account: '213-151-1223165', amount: '309,210원', date: '2024/11/03', button: <BaseButton text={buttonText}  /> },
    //     { name: '류혜리', account: '111-15795-246821', amount: '309,210원', date: '2024/09/03', button:<BaseButton text={buttonText}  />},
    //     { name: '임지혁', account: '258-1467-284567', amount: '309,210원', date: '2023/10/03', button: <BaseButton text={buttonText}  /> },
    //     { name: '박준현', account: '258-1467-284567', amount: '309,210원', date: '2024/10/05', button:  <BaseButton text={buttonText}  />},
    //     { name: '강세필', account: '258-1467-284567', amount: '309,210원', date: '2024/10/09', button: <BaseButton text={buttonText}  /> },
    // ]);


    // 선택된 년, 월과 검색어에 맞는 데이터 필터링
    const filteredList = list.filter(item => {
        const itemDate = new Date(item.date);
        return (
            itemDate.getFullYear() === selectedDate.getFullYear() &&
            itemDate.getMonth() === selectedDate.getMonth() &&
            item.name.includes(searchQuery)
        );
    });

    // 정렬 기준에 따라 리스트 정렬
    const sortedList = filteredList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (sortOption === 'latest') {
            return dateB - dateA; // 최신순 정렬
        } else {
            return dateA - dateB; // 오래된 순 정렬
        }
    });

    // bankCodeList와 매칭하여 SVG 추가한 리스트 생성
    const updatedList = sortedList.map(item => {
        const bank = bankCodeList.find(bank => bank.code === item.code); // 코드로 은행 찾기
        const updatedAccount = bank ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
    <div
        className={classes.bankIcon} // SVG 스타일 추가
        dangerouslySetInnerHTML={{ __html: bank.logoUrl }} // SVG 삽입
    />
    <span style={{ textAlign: 'center' }}>{item.account}</span> {/* 계좌번호 표시 */}
</span>

        ) : (
            <span>{item.account}</span> /* 매칭되지 않은 경우 계좌번호만 반환 */
        );
    
        return {
            ...item,
            account: updatedAccount, // 계좌번호에 SVG 포함
        };
    });
    

    const tableHeaders = {
        name: '직원 이름',
        account: '계좌번호',
        amount: '이체 금액',
        date: '이체 날짜',
        button: '급여 명세서'
    };

    return (
        <div className={classes.container}>
            {/* 상단 헤더 영역 */}
            <div className={classes.header}>
                <MonthSelector onMonthChange={handleMonthChange} />
                <div className={classes.filtering}>
                    <NameSearch onChange={handleSearchChange} />
                    <Sorting onChange={handleSortChange} selectedOption={sortOption} />
                </div>
            </div>

            {/* 테이블 영역 */}
            <DefaultTable
                tableHeaders={tableHeaders}
                list={updatedList}
            />
        </div>
    );
}
