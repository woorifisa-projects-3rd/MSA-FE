"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import DefaultTable from "@/components/table/DefaultTable";
import MonthSelector from "@/components/selector/selector";
import NameSearch from "@/components/namesearch/name-search";
import Sorting from "@/components/sorting/sorting";
import { nextClient } from "@/lib/nextClient";
import BaseButton from "@/components/button/base-button";
import { bankCodeList } from "@/constants/bankCodeList";
import { useAuth } from "@/contexts/AuthProvider";
import ModalContainer from "@/components/modal/modal-container";
import classes from "./page.module.css";

export default function PayRecords() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortOption, setSortOption] = useState("latest"); // 최신순 디폴트
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState("0");

  const { storeId } = useAuth();
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;

  // 데이터 로드
  useEffect(() => {
    if (storeId) {
      const loadPayStatementPageData = async () => {
        try {
          const response = await nextClient.get("/attendance/paystatement/employees", {
            params: {
              storeId,
              selectedYear,
              selectedMonth,
            },
          });

          console.log('급여기록 데이터 : ',response.data);
          const data = response.data.data;
          const formattedData = data.map((item) => ({
            name: item.name,
            account: item.accountNumber,
            amount: item.amount === 0 ? "0" : item.amount,
            date: item.issuanceDate,
            button: <BaseButton text="확인" onClick={() => handleViewStatement(item.payStatementId)}  />,
          }));
          setList(formattedData);
        } catch (error) {
          console.error("급여 기록 로드 오류:", error.message);
        }
      };
      loadPayStatementPageData();
    }
  }, [storeId, selectedYear, selectedMonth]);

        // 확인 버튼 클릭 시 급여 명세서 보기
        const handleViewStatement = async (payStatementId) => {
            console.log(payStatementId);
            try {
                const response = await nextClient.get(`/attendance/paystatement`, {
                    params: { paystatementid: payStatementId }, // Query Parameter로 전달
                });

                if (response.data.success && response.data.data) {
                    const url = response.data.data;
                    console.log("급여 명세서 URL:", url);

                    // URL이 이미 절대 경로라면 그대로 사용
                    if (url.startsWith("http")) {
                        // URL이 절대 경로일 경우 그대로 사용
                        window.open(url, "_blank");
                    } else {
                        console.error("유효하지 않은 URL 형식입니다.");
                        alert("급여 명세서를 로드할 수 없습니다.");
                    }
                } else {
                    console.error("유효하지 않은 URL 응답:", response.data);
                    alert("급여 명세서를 로드할 수 없습니다.");
                }
            } catch (error) {
                console.error("급여 명세서 로드 오류:", error.message);
            }
        };


  // 이벤트 핸들러
  const handleMonthChange = (newDate) => setSelectedDate(newDate);
  const handleSortChange = (event) => setSortOption(event.target.value);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 자동이체 설정 처리
  const handleAutoTransferSelection = async (type) => {
    try {
      const response = await nextClient.post("/president/termaccept", {
        termsAccept: type === "1",
      });
      if (response.data.success) {
        console.log("자동이체 처리 성공:", response.data.success);
      } 
    } catch (error) {
        console.log("자동이체처리 error", error.response.data.error)
    }
    setIsModalOpen(false);
  };

  // 리스트 필터링 및 정렬
  const filteredList = list.filter((item) => item.name.includes(searchQuery));
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

  return (
    <div className={classes.container}>
      {/* 상단 헤더 */}
      <div className={classes.header}>
        <MonthSelector onMonthChange={handleMonthChange} />
        <div className={classes.filtering}>
          <Sorting onChange={handleSortChange} selectedOption={sortOption} />
          <NameSearch onChange={handleSearchChange} placeholder="이름으로 검색" />
          <BaseButton text="자동이체 설정" onClick={openModal} />
        </div>
      </div>

      {/* 자동이체 설정 모달 */}
      <ModalContainer
        isOpen={isModalOpen}
        onClose={closeModal}
        title="자동이체 설정"
        onConfirm={() => handleAutoTransferSelection(selectedBusinessType)}
        >
        <div className={classes.modalRadioGroup}>
            <label>
            <input
                type="radio"
                name="termsAccept"
                value="1"
                checked={selectedBusinessType === "1"}
                onChange={() => setSelectedBusinessType("1")}
            />
            자동이체 신청
            </label>
            <label>
            <input
                type="radio"
                name="termsAccept"
                value="0"
                checked={selectedBusinessType === "0"}
                onChange={() => setSelectedBusinessType("0")}
            />
            자동이체 해제
            </label>
        </div>
        <div className={classes.modalFeeInfo}>
            <p>※ 자동이체 신청 시, 이체 금액의 <strong>0.1%</strong>가 수수료로 부과됩니다.</p>
        </div>
        </ModalContainer>

      {/* 테이블 */}
      <DefaultTable tableHeaders={tableHeaders} list={updatedList} />
    </div>
  );
}
