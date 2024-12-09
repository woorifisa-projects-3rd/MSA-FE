"use client";

import React, { useState, useEffect, cloneElement } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
} from "chart.js";
import BaseButton from "@/components/button/base-button";
import { nextClient } from "@/lib/nextClient";
import { PdfnextClient } from "@/lib/PdfnextClient";
import ModalContainer from "@/components/modal/modal-container";
import classes from "./page.module.css";
import styles from './ModalStyles.module.css';
import Loading from '@/components/loading/Loading';
import { useAuth } from '@/contexts/AuthProvider';
import { financeApi } from "@/api/financeApi";
import { chartUtils } from "@/utils/chartUtils";
import { pdfUtils } from "@/utils/pdfUtils";

ChartJS.register(
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale
);

export default function SalesExpenses() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [list, setList] = useState({ 매출: [], 지출: [] });
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [salesData, setSalesData] = useState({});
  const [expensesData, setExpensesData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null); // 선택된 사업자 유형 상태
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const EmptyStateMessage = ({ message }) => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>📊</div>
      <p>{message}</p>
    </div>
  );

  const {storeId} = useAuth();
  const [isStoreIdLoading, setIsStoreIdLoading] = useState(true);

   // storeId 로딩 상태 체크
   useEffect(() => {
    console.log("storeId 가져오는 중 !! ")
    setIsStoreIdLoading(false); // useAuth 훅의 데이터가 로드되면 로딩 상태 false로
  }, [storeId]);


  console.log("storeId?",storeId);

  // storeId ,selectedYear, selectedMonth가 변할 때마다 왼쪽 섹션 sales data, expenses data 새로 가져오기
  useEffect(() => {
    const loadTransactionAnalyticsPageData = async () => {
      try {
        setIsLoading(true);
        console.log("transaction-chart 데이터 요청 중!!")
        // sales data와 expenses data를 가져오기 위한 api
        const result = await financeApi.getTransactionChart(storeId, selectedYear, selectedMonth)
       
        // 응답을 실패한 경우
        if (!result.success) {
          // 오류 응답 데이터 확인 후 적절한 메시지 설정
          if (result.error && result.error.includes("계좌 정보를 찾을 수 없습니다.")) {
            setError("계좌 정보를 찾을 수 없습니다. 관리자에게 문의해주세요.");
          } else {
            setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
          console.log("트랜잭션 차트 요청 페이지", result.error)
          return;
        }

        // 성공시 에러 상태 초기화
        setError(null);

        const data = result.data;

        console.log("차트 페이지 - 서버에서 받는 원본 매출/지출 데이터", data)

        // 현재 월의 데이터 필터링 
        // 'data.sales'와 'data.expenses'가 undefined일 경우 빈 배열로 처리
        const filteredSales = (data.data.sales || []).filter(
          (item) =>
            new Date(item.transactionDate).getFullYear() === selectedYear &&
            new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );
        const filteredExpenses = (data.data.expenses || []).filter(
          (item) =>
            new Date(item.transactionDate).getFullYear() === selectedYear &&
            new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );

        // 카테고리별 합계 계산

        const calculateCategoryTotals = (items) => {
          const categories = [
            ...new Set(items.map((item) => item.classificationName)),
          ];
          return categories.map((category) => ({
            category,
            total: items
              .filter((item) => item.classificationName === category)
              .reduce((sum, item) => sum + parseInt(item.amount), 0),
          }));
        };

        console.log("지출/매출 페이지 filterdSales", filteredSales);

        // 카테고리별 합계 계산
        const salesCategoryTotals = calculateCategoryTotals(filteredSales);
        const expensesCategoryTotals = calculateCategoryTotals(filteredExpenses);
         
        console.log(salesCategoryTotals, expensesCategoryTotals)
          
        // 월별 데이터 -> 오른쪽 섹션 차트를 위한 1년 월별 데이터
        const monthlySales = data.data.monthlySales;

  

        setList({ 매출: filteredSales, 지출: filteredExpenses });
        setTotalSales(data.data.totalSales || 0);
        setTotalExpenses(data.data.totalExpenses || 0);
        setMonthlySalesData(monthlySales || []);
        console.log("최종 montnlySaelsData?",monthlySalesData);



        // 차트 데이터 생성
        const salesProcessed = chartUtils.processChartData(salesCategoryTotals);
        const expensesProcessed = chartUtils.processChartData(expensesCategoryTotals);
        console.log("salesProcessed",salesProcessed)
    

        // 가공된 sales data와 expens data를 저장
        setSalesData({
          labels: salesProcessed.labels,
          datasets: [
            {
              label: "매출 카테고리별",
              data: salesProcessed.data,
              hoverOffset: 6,
              backgroundColor: chartUtils.chartColors,
            },
          ],
        });

        setExpensesData({
          labels: expensesProcessed.labels,
          datasets: [
            {
              label: "지출 카테고리별",
              data: expensesProcessed.data,
              hoverOffset: 6,
              backgroundColor: chartUtils.chartColors,
            },
          ],
        });

      }  catch (error) {
        setError("예상치 못한 오류가 발생했습니다.");
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };
    loadTransactionAnalyticsPageData();
  }, [storeId, selectedYear, selectedMonth, isStoreIdLoading]);


  console.log("error",error);
  // 간편장부
  const handleBusinessTypeSelection = async (type) => {
    setSelectedBusinessType(type);
    console.log(`${type} 선택 완료`);

    try {
      const result = await financeApi.generateSimpleLedgerPDF(
        storeId,
        selectedYear,
        selectedMonth,
        type
      );

      if (!result.success) {
        alert(result.error);
        return;
      }

      handleCloseModal();

      const fileName = pdfUtils.generateFileName(
        selectedYear,
        selectedMonth,
        "간편장부"
      );
      pdfUtils.downloadPDF(result.data, fileName);

    } catch (error) {
      console.error("간편장부 요청 실패:", error);
      alert("간편장부 요청 중 오류가 발생했습니다.");
    }
  };

  // 손익계산서
  const handleGenerateIncomeStatement = async () => {
      try {
        const result = await financeApi.generateIncomeStatementPDF(
          storeId, 
          selectedYear, 
          selectedMonth
      );

      if(!result.success){
        alert(result.error);
        return;
      }

      console.log("데이터: ", result.data);

      // 동적으로 파일명 설정
      const fileName = pdfUtils.generateFileName(selectedYear, selectedMonth, "손익계산서");
      // pdf로 다운
      pdfUtils.downloadPDF(result.data, fileName);
   
    } catch (error) {
      console.error("손익계산서 요청 실패:", error);
      alert("손익계산서 요청 중 오류가 발생했습니다.");
    }
  };

  // 월별 매출 막대형 차트 데이터
  const monthlySalesBarData = {
    labels: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    datasets: [
      {
        data: monthlySalesData,
        backgroundColor: "#F6C89F",
      },
    ],
  };

 

  return (
    <div className={classes.container}>
      <div className={classes.selectContainer}>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[...Array(5)].map((_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <option key={year} value={year}>
                {year}년
              </option>
            );
          })}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}월
            </option>
          ))}
        </select>
      </div>

      <div className={classes.gridContainer}>
        {isLoading ? (
          <Loading />
        ): (
          <>
            <div className={classes.leftSection}>
              {/* 왼쪽 섹션 매출/지출 카드 */}
              <div className={classes.summaryContainer}>
                {/* 왼쪽 매출 카드 */}
                <div className={classes.card}>
                  <div className={classes.icon}>📈</div>
                  <div className={classes.textContainer}>
                    <h3>
                      매출
                        <span className={classes.tooltip}>
                          원가를 감하지 않은, 일일 매출 정산금과 온라인 결제 정산금 등을 포함한 총 매출액입니다.
                        </span>
                    </h3>
                    <p>{totalSales ? totalSales.toLocaleString() : 0}원</p>
                  </div>
                </div>
                {/* 오른쪽 지출 카드 */}
                <div className={classes.card}>
                  <div className={classes.icon}>📉</div>
                  <div className={classes.textContainer}>
                    <h3>
                      지출
                        <span className={classes.tooltip2}>
                          식자재, 인건비, 임대료 등 모든 지출의 합계입니다.
                        </span>
                    </h3>
                
                    <p>{totalExpenses ? totalExpenses.toLocaleString() : 0}원</p>
                  </div>
                </div>
              </div>


              {/* 왼쪽 섹션 차트 컨테이너  */}
              <div
                className={classes.chartContainer}
                style={{ position: "relative" }}
              >
                {error ? (
                  <div className={styles.errorMessage}>{error}</div>
                ) : (
                  <>
                    <div className={classes.chartStyle}>
                      {!salesData.labels || (salesData.labels && salesData.datasets[0].data.length === 0) ? (
                        <EmptyStateMessage message={`${selectedYear}년 ${selectedMonth}월의 매출 데이터가 없습니다.`} />
                      ) : (
                        <Doughnut data={salesData} options={chartUtils.donutChartOptions} />
                      )}
                    </div>
                    <div className={classes.chartStyle}>
                      {!expensesData.labels || (expensesData.labels && expensesData.datasets[0].data.length === 0) ? (
                        <EmptyStateMessage message={`${selectedYear}년 ${selectedMonth}월의 지출 데이터가 없습니다.`} />
                      ) : (
                        <Doughnut data={expensesData} options={chartUtils.donutChartOptions} />
                      )}
                    </div>
                  </>
                )}
              
              </div>
            </div>

            <div className={classes.rightSection}>
              <h2>{selectedYear}년 월별 매출</h2>
              {monthlySalesBarData?.datasets ? ( // 데이터셋 확인
                <Bar data={monthlySalesBarData} options={chartUtils.barChartOptions} className={classes.barContainer} />
              ) : (
                <Loading />
              )}

              <div className={classes.reportsContainer}>
                {salesData.labels && expensesData.labels ? (
                  <>
                    <BaseButton
                      text="손익계산서 발급"
                      onClick={handleGenerateIncomeStatement}
                    />
                    <BaseButton text="간편장부 발급" onClick={handleOpenModal} />
                  </>
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          </>
        )}
    
      </div>

      <ModalContainer
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="사업자 유형 선택"
          onConfirm={() => handleBusinessTypeSelection(selectedBusinessType)}
        >
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.businessTypeButton} ${
              selectedBusinessType === "0" ? styles.selected : ""
            }`}
            onClick={() => setSelectedBusinessType("0")}
          >
            <p>
              💡 <strong>간이사업자</strong>
            </p>
            <span>연 매출이<br/>
            <dev className={styles.highlight}>1억 400만원<br/>미만</dev>
            인 경우<br/>선택하세요.</span>
          </button>
          <button
            className={`${styles.businessTypeButton} ${
              selectedBusinessType === "1" ? styles.selected : ""
            }`}
            onClick={() => setSelectedBusinessType("1")}
          >
            <p>
              📊 <strong>일반사업자</strong>
            </p>
            <span>연 매출이<br/>
            <dev className={styles.highlight}>1억 400만원<br/>이상</dev>
            인 경우<br/>선택하세요.</span>
          </button>
        </div>
      </ModalContainer>
    </div>
  );
}
