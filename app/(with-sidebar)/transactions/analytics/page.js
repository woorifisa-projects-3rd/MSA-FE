'use client';

import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import classes from "./page.module.css";
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale } from 'chart.js';
import BaseButton from '@/components/button/base-button';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, Colors, CategoryScale, LinearScale);

// 더미 데이터
const dummyData = {
  매출: [
    { transactionDate: '2024-11-01', amount: '1500000', isDeposit: true, classficationCode: '일일 매출 입금'},
    { transactionDate: '2024-11-10', amount: '1000000', isDeposit: true, classficationCode: '카드 매출 정산금' },
    { transactionDate: '2024-10-20', amount: '500000', isDeposit: true, classficationCode: '현금 매출 입금' },
    { transactionDate: '2024-10-01', amount: '1500000', isDeposit: true, classficationCode: '일일 매출 입금'},
    { transactionDate: '2024-11-10', amount: '1000000', isDeposit: true, classficationCode: '카드 매출 정산금' },
    { transactionDate: '2024-11-20', amount: '500000', isDeposit: true, classficationCode: '온라인 결제 정산' },
  ],
  지출: [
    { transactionDate: '2024-10-05', amount: '300000', isDeposit: false, transactionType: 'card', classficationCode: '임대료' },
    { transactionDate: '2024-11-15', amount: '800000', isDeposit: false, transactionType: 'cash', classficationCode: '인건비' },
    { transactionDate: '2024-10-25', amount: '300000', isDeposit: false, transactionType: 'card', classficationCode: '관리비' },
    { transactionDate: '2024-11-05', amount: '300000', isDeposit: false, transactionType: 'card', classficationCode: '인건비' },
    { transactionDate: '2024-11-15', amount: '800000', isDeposit: false, transactionType: 'cash', classficationCode: '도시가스비' },
    { transactionDate: '2024-11-25', amount: '300000', isDeposit: false, transactionType: 'card', classficationCode: '카드수수료' },
  ],
  '월별 매출': [1000000, 2000000, 1500000, 1700000, 1200000, 1800000, 1400000, 1300000, 1600000, 1900000, 1750000, 2100000],
  총매출: 4500000,
  총지출: 1600000
};

export default function SalesExpenses() {
  const [data, setData] = useState(dummyData);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 선택된 년, 월에 따라 매출 지출 필터링
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
  
  const salesCategoryTotals = calculateCategoryTotals(filteredSales);
  const expensesCategoryTotals = calculateCategoryTotals(filteredExpenses);
  
  // 매출 도넛형 차트 데이터
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
  
  // 지출 도넛형 차트 데이터
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

  // 월별 매출 막대형 차트 데이터
  const monthlySalesData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: `${selectedYear}년 월별 매출`,
        data: data['월별 매출'],
      },
    ],
  };

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

      {/* 매출/지출 합계 표시 */}
    <div className={classes.summaryContainer}>
    <div className={classes.card}>
        <div className={classes.icon}>
        📈
        </div>
        <div className={classes.textContainer}>
        <h3>매출</h3>
        <p>{dummyData.총매출.toLocaleString()}원</p>
        </div>
    </div>
    
    <div className={classes.card}>
        <div className={classes.icon}>
        📉
        </div>
        <div className={classes.textContainer}>
        <h3>지출</h3>
        <p>{dummyData.총지출.toLocaleString()}원</p>
        </div>
    </div>
    </div>


      {/* 매출 및 지출 도넛형 차트 */}
      <div className={classes.chartContainer}>
        <div>
          <h2>매출</h2>
          <Doughnut data={salesData} options={options} />
        </div>
        <div>
          <h2>지출</h2>
          <Doughnut data={expensesData} options={options} />
        </div>
      </div>

      {/* 월별 매출 막대형 차트 */}
      <div className={classes.barChartContainer}>
        <h2>월별 매출</h2>
        <Bar data={monthlySalesData} options={options} />
      </div>

      {/* 서류 발급 버튼 */}
      <div className={classes.reportsContainer}>
        <BaseButton text="손익계산서 발급" />
        <BaseButton text="간편장부 발급" />
      </div>
    </div>
  );
}
