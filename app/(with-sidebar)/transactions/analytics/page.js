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
  const [error, setError] = useState("");


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const {storeId} = useAuth();
  console.log("storeId?",storeId);


  useEffect(() => {
    const loadTransactionAnalyticsPageData = async () => {

      console.log(selectedYear, selectedMonth);


      try {
        const response = await nextClient.get('/finance/analytics/transactionchart', {
          params: {
            storeId: storeId,
            selectedYear: selectedYear,
            selectedMonth: selectedMonth,
          },
        });
       
        const data = response.data;

        // if(response.data){
          
        // }
        console.log("차트 페이지 - 서버에서 받는 원본 매출/지출 데이터", data)

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
        const salesCategoryTotals = calculateCategoryTotals(filteredSales);
        const expensesCategoryTotals =
          calculateCategoryTotals(filteredExpenses);
        const monthlySales = data.data.monthlySales;

        // 카테고리 5개까지, 나머지는 '기타'로
        const processChartData = (categories, maxLabels = 5) => {
          const sortedCategories = [...categories].sort(
            (a, b) => b.total - a.total
          );

          const topCategories = sortedCategories.slice(0, maxLabels);
          const others = sortedCategories.slice(maxLabels);

          const topLabels = topCategories.map((item) => item.category);
          const topData = topCategories.map((item) => item.total);

          if (others.length > 0) {
            topLabels.push("기타");
            topData.push(others.reduce((sum, item) => sum + item.total, 0));
          }

          return { labels: topLabels, data: topData };
        };

        setList({ 매출: filteredSales, 지출: filteredExpenses });
        setTotalSales(data.data.totalSales || 0);
        setTotalExpenses(data.data.totalExpenses || 0);
        setMonthlySalesData(monthlySales || []);
        console.log(data.data.monthlySales);

        const salesProcessed = processChartData(salesCategoryTotals);
        const expensesProcessed = processChartData(expensesCategoryTotals);

        const chartColors = [
          "#FF8C42", // 부드러운 오렌지
          "#FFA559", // 연한 살구색
          "#FFD57E", // 밝은 머스타드
          "#FFE8A3", // 은은한 크림 노랑
          "#FFF4D2", // 연한 레몬빛
          "#F6C89F", // 따뜻한 코랄 주황
        ];

        setSalesData({
          labels: salesProcessed.labels,
          datasets: [
            {
              label: "매출 카테고리별",
              data: salesProcessed.data,
              hoverOffset: 6,
              backgroundColor: chartColors,
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
              backgroundColor: chartColors,
            },
          ],
        });
      } catch (error) {
        console.error("손익계산서 요청 실패:", error);
      }
    };
    loadTransactionAnalyticsPageData();
  }, [storeId ,selectedYear, selectedMonth]);

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
        },
      },
    },
  };

  // 간편장부
  const handleBusinessTypeSelection = async (type) => {
    setSelectedBusinessType(type);
    console.log(`${type} 선택 완료`);

    try {
      const response = await PdfnextClient.post(
        `/finance/analytics/transactionsimplepdf`,
        {
          storeId: storeId,
          selectedYear: selectedYear,
          selectedMonth: selectedMonth,
          type: type,
        }, // 요청 본문
        { responseType: 'arraybuffer' }
      );
      console.log("데이터: ", response.data);

      handleCloseModal();

      const pdfBlob = new Blob([new Uint8Array(response.data)], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const fileName = `${selectedYear}년_${String(selectedMonth).padStart(
        2,
        "0"
      )}월_간편장부.pdf`;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("간편장부 요청 실패:", error);
      alert("간편장부 요청 중 오류가 발생했습니다.");
    }
  };

  // 손익계산서
  const handleGenerateIncomeStatement = async () => {
    try {
      const response = await PdfnextClient.post(
        `/finance/analytics/transactionpdf`,
        {
          storeId: storeId,
          selectedYear: selectedYear,
          selectedMonth: selectedMonth,
        }, // 요청 본문
        { responseType: 'arraybuffer' }
      );

      console.log("데이터: ", response.data);

      const pdfBlob = new Blob([new Uint8Array(response.data)], {
        type: "application/pdf",
      });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // 동적으로 파일명 설정
      const fileName = `${selectedYear}년_${String(selectedMonth).padStart(
        2,
        "0"
      )}월_손익계산서.pdf`;

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", fileName); // 동적 파일명
      document.body.appendChild(link);
      link.click();
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
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

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: "",
        position: "bottom",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            if (value >= 1000000) {
              return `${value / 1000000}백만`; // 100만 단위로 변환
            }
          },
        },
      },
    },
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
            {/* {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )} */}
            <div className={classes.chartStyle}>
              {/* <h2>매출</h2> */}
              {salesData.labels ? (
                <Doughnut data={salesData} options={donutChartOptions} />
              ) : (
                <Loading />
              )}
            </div>
            <div className={classes.chartStyle}>
              {/* <h2>지출</h2> */}
              {expensesData.labels ? (
                <Doughnut data={expensesData} options={donutChartOptions} />
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </div>

        <div className={classes.rightSection}>
          <h2>{selectedYear}년 월별 매출</h2>
          {monthlySalesBarData?.datasets ? ( // 데이터셋 확인
            <Bar data={monthlySalesBarData} options={barChartOptions} className={classes.barContainer} />
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
