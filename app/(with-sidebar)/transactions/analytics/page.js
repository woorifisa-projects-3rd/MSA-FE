'use client';

import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import classes from "./page.module.css";
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale } from 'chart.js';
import BaseButton from '@/components/button/base-button';
import { nextClient } from '@/lib/nextClient';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale);

export default function SalesExpenses() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [list, setList] = useState({ 매출: [], 지출: [] });
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [salesData, setSalesData] = useState({});  // 초기값을 빈 객체로 설정
  const [expensesData, setExpensesData] = useState({});  // 초기값을 빈 객체로 설정

  useEffect(() => {
    const loadTransactionAnalyticsPageData = async () => {
      try {
        const response = await nextClient.get('/bank/list', {
          params: {
            storeid: 3, // 고정된 스토어 ID
            year: selectedYear, // 선택된 연도
            month: selectedMonth, // 선택된 월
          },
        });

        const data = response.data;

        console.log('응답 데이터: ', data);

        // 매출 및 지출 데이터 필터링
        const filteredSales = data.매출.filter(
          (item) => new Date(item.transactionDate).getFullYear() === selectedYear &&
                    new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );
        const filteredExpenses = data.지출.filter(
          (item) => new Date(item.transactionDate).getFullYear() === selectedYear &&
                    new Date(item.transactionDate).getMonth() + 1 === selectedMonth
        );

        // 매출 및 지출 카테고리별 합계 계산
        const calculateCategoryTotals = (items) => {
          const categories = [...new Set(items.map(item => item.classficationCode))];
          return categories.map(category => ({
            category,
            total: items
              .filter(item => item.classficationCode === category)
              .reduce((sum, item) => sum + parseInt(item.amount), 0)
          }));
        };

        // 카테고리별 합계 계산
        const salesCategoryTotals = calculateCategoryTotals(filteredSales);
        const expensesCategoryTotals = calculateCategoryTotals(filteredExpenses);

        // 월별 매출 데이터 계산 (여기서는 예시로 월별 매출을 설정)
        const monthlySales = data['월별 매출'];

        // 상태 업데이트
        setList({ 매출: filteredSales, 지출: filteredExpenses });
        setTotalSales(data.총매출);
        setTotalExpenses(data.총지출);
        setMonthlySalesData(monthlySales);

        // 차트 데이터 설정
        const salesData = {
          labels: salesCategoryTotals.map(item => item.category),
          datasets: [
            {
              label: '매출 카테고리별',
              data: salesCategoryTotals.map(item => item.total),
              hoverOffset: 6,
            },
          ],
        };

        const expensesData = {
          labels: expensesCategoryTotals.map(item => item.category),
          datasets: [
            {
              label: '지출 카테고리별',
              data: expensesCategoryTotals.map(item => item.total),
              hoverOffset: 6,
            },
          ],
        };

        // 차트 업데이트
        setSalesData(salesData);
        setExpensesData(expensesData);
      } catch (error) {
        console.error('API 호출 실패: ', error);
      }
    };

    loadTransactionAnalyticsPageData();
  }, [selectedYear, selectedMonth]);

  // 차트 옵션
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectContainer}>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {[2024, 2023, 2022, 2021, 2020].map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}월
            </option>
          ))}
        </select>
      </div>

      <div className={classes.gridContainer}>

        {/* 왼쪽 섹션 */}
        <div className={classes.leftSection}>
          {/* 매출/지출 합계 표시 */}
          <div className={classes.summaryContainer}>
            <div className={classes.card}>
              <div className={classes.icon}>
                📈
              </div>
              <div className={classes.textContainer}>
                <h3>매출</h3>
                <p>{totalSales.toLocaleString()}원</p>
              </div>
            </div>
            
            <div className={classes.card}>
              <div className={classes.icon}>
                📉
              </div>
              <div className={classes.textContainer}>
                <h3>지출</h3>
                <p>{totalExpenses.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          {/* 매출 및 지출 도넛형 차트 */}
          <div className={classes.chartContainer}>
            <div>
              <h2>매출</h2>
              {salesData.labels ? (
                <Doughnut data={salesData} options={options} />
              ) : (
                <p>매출 데이터 로딩 중...</p>
              )}
            </div>
            <div>
              <h2>지출</h2>
              {expensesData.labels ? (
                <Doughnut data={expensesData} options={options} />
              ) : (
                <p>지출 데이터 로딩 중...</p>
              )}
            </div>
          </div>

          {/* 서류 발급 버튼 */}
          <div className={classes.reportsContainer}>
            <BaseButton text="손익계산서 발급" />
            <BaseButton text="간편장부 발급" />
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className={classes.rightSection}>
          <div>
            월별 매출 막대형 차트
          </div>
          <div className={classes.barChartContainer}>
            <h2>월별 매출</h2>
            {monthlySalesData.length > 0 ? (
              <Bar className={classes.bar} data={monthlySalesData} options={options} />
            ) : (
              <p>월별 매출 데이터 로딩 중...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
