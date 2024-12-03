"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import classes from "./page.module.css";
import DefaultTable from "@/components/table/DefaultTable";
import MonthSelector from "@/components/selector/selector";
import NameSearch from "@/components/namesearch/name-search";
import Sorting from "@/components/sorting/sorting";
import { nextClient } from "@/lib/nextClient";
import BaseButton from "@/components/button/base-button";
import { bankCodeList } from "@/constants/bankCodeList";
import { useAuth } from "@/contexts/AuthProvider";
import ModalContainer from "@/components/modal/modal-container"; // 모달 컴포넌트 추가

export default function PayRecords() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortOption, setSortOption] = useState("latest"); // 최신순 디폴트
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [selectedBusinessType, setSelectedBusinessType] = useState("0"); // 자동이체 신청/해제 상태

  const { storeId } = useAuth();
  const selectedYear = selectedDate.getFullYear(); // 연도 추출
  const selectedMonth = selectedDate.getMonth() + 1; // 월 추출 (1부터 시작)

  useEffect(() => {
    const loadPayStatementPageData = async () => {
      try {
        const response = await nextClient.get(
          `/attendance/paystatement/employees?storeid=${storeId}&year=${selectedYear}&month=${selectedMonth}`
        );
        const data = response.data.data;
        const formattedData = data.map((item) => ({
          name: item.name,
          account: item.accountNumber,
          amount: item.amount === 0 ? "0" : item.amount,
          date: item.issuanceDate,
          button: <BaseButton text="확인" />,
        }));
        setList(formattedData);
      } catch (error) {
        console.error("급여기록 정보 로드 에러:", error.message);
      }
    };
    loadPayStatementPageData();
  }, [selectedYear, selectedMonth, storeId]);

  const handleMonthChange = (newDate) => setSelectedDate(newDate);

  const handleSortChange = (event) => setSortOption(event.target.value);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  // 필터링된 리스트와 정렬 처리
  const filteredList = list.filter((item) => {
    const itemDate = new Date(item.date);
    return (
        <div className={classes.container}>
            {/* 상단 헤더 영역 */}
            <div className={classes.header}>
                <MonthSelector onMonthChange={handleMonthChange} />
                <div className={classes.filtering}>
                    <NameSearch onChange={handleSearchChange} placeholder="이름으로 검색"/>
                    <Sorting onChange={handleSortChange} selectedOption={sortOption} />
                    <NameSearch onChange={handleSearchChange} />
                    <BaseButton text="자동이체 설정" onClick={openModal} />
                </div>
            </div>

            {/* 자동이체 설정 모달 */}
            <ModalContainer isOpen={isModalOpen} onClose={closeModal} title="자동이체 설정" onConfirm={() => handleBusinessTypeSelection(selectedBusinessType)}>
                <div className={classes.modalRadioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="termsAccept"
                            value="0"
                            checked={selectedBusinessType === '1'}
                            onChange={() => setSelectedBusinessType('1')}
                        />
                        자동이체 신청
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="termsAccept"
                            value="1"
                            checked={selectedBusinessType === '0'}
                            onChange={() => setSelectedBusinessType('0')}
                        />
                        자동이체 해제
                    </label>
                </div>
            </ModalContainer>

            {/* 테이블 영역 */}
            <DefaultTable tableHeaders={tableHeaders} list={updatedList} />
        </div>
    );
  });

  const sortedList = filteredList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOption === "latest" ? dateB - dateA : dateA - dateB;
  });

  const updatedList = sortedList.map((item) => {
    const bank = bankCodeList.find((bank) => bank.code === item.code);
    const updatedAccount = bank ? (
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          className={classes.bankIcon}
          dangerouslySetInnerHTML={{ __html: bank.logoUrl }}
        />
        <span>{item.account}</span>
      </span>
    ) : (
      <span>{item.account}</span>
    );
    return { ...item, account: updatedAccount };
  });

  const tableHeaders = {
    name: "직원 이름",
    account: "계좌번호",
    amount: "이체 금액",
    date: "이체 날짜",
    button: "급여 명세서",
  };

  // 자동이체 설정
  const handleAutoTransferSelection = async (type) => {
    const termsAccept = type === "1"; // '1'이면 true, '0'이면 false

    try {
      const response = await nextClient.post("/api/termaccept", {
        termsAccept,
      });
      if (response.data.success) {
        console.log("자동이체 처리 성공:", response.data);
      } else {
        console.error("자동이체 처리 실패:", response.data.message);
      }
    } catch (error) {
      console.error("자동이체 요청 실패:", error.message);
    }
  };

  // 모달 열기 함수
  const openModal = () => setIsModalOpen(true);

  // 모달 닫기 함수
  const closeModal = () => setIsModalOpen(false);

  // 자동이체 신청/해제 처리
  const handleBusinessTypeSelection = (type) => {
    setSelectedBusinessType(type);
    // 여기에서 API 호출을 통해 자동이체 신청/해제를 처리할 수 있습니다.
    console.log("선택한 자동이체 유형:", type);
  };

  return (
    <div className={classes.container}>
      {/* 상단 헤더 영역 */}
      <div className={classes.header}>
        <MonthSelector onMonthChange={handleMonthChange} />
        <div className={classes.filtering}>
          <Sorting onChange={handleSortChange} selectedOption={sortOption} />
          <NameSearch onChange={handleSearchChange} />
          <BaseButton text="자동이체 설정" onClick={openModal} />
        </div>
      </div>

      {/* 자동이체 설정 모달 */}
      <ModalContainer
        isOpen={isModalOpen}
        onClose={closeModal}
        title="자동이체 설정"
        onConfirm={() => handleBusinessTypeSelection(selectedBusinessType)}
      >
        <div className={classes.modalRadioGroup}>
          <label>
            <input
              type="radio"
              name="termsAccept"
              value="0"
              checked={selectedBusinessType === "1"}
              onChange={() => setSelectedBusinessType("1")}
            />
            자동이체 신청
          </label>
          <label>
            <input
              type="radio"
              name="termsAccept"
              value="1"
              checked={selectedBusinessType === "0"}
              onChange={() => setSelectedBusinessType("0")}
            />
            자동이체 해제
          </label>
        </div>
      </ModalContainer>

      {/* 테이블 영역 */}
      <DefaultTable tableHeaders={tableHeaders} list={updatedList} />
    </div>
  );
}
