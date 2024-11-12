'use client';

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import classes from "./page.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';
import BaseButton from '@/components/button/base-button';

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const generateDummyData = () => {
  return {
    sales: [
      { category: '일일 매출 입금', amount: 5000000 },
      { category: '카드 매출 정산금', amount: 2000000 },
      { category: '현금 매출 입금', amount: 1000000 },
      { category: '온라인 결제 정산', amount: 800000 },
    ],
    expenses: [
      { category: '임대료', amount: 2000000 },
      { category: '인건비', amount: 1500000 },
      { category: '관리비', amount: 2500000 },
      { category: '도시가스비', amount: 1200000 },
      { category: '카드수수료', amount: 500000 },
    ],
  };
};

export default function SalesExpenses() {
  const { sales, expenses } = generateDummyData();

  const salesData = {
    labels: sales.map(item => item.category),
    datasets: [
      {
        label: '매출',
        data: sales.map(item => item.amount),
        hoverOffset: 6,
      },
    ],
  };

  const expensesData = {
    labels: expenses.map(item => item.category),
    datasets: [
      {
        label: '지출',
        data: expenses.map(item => item.amount),
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true, // 반응형 동작
    plugins: {
      legend: {
        position: 'bottom' // 범례를 차트 하단에 배치
      }
    },
  };

  return (
    <div className={classes.container}>
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
      <div className={classes.salesContainer}>
        일, 주, 월 매출 차트
      </div>
      <div className={classes.reportsContainer}>
        <BaseButton text="손익계산서 발급"/>
        <BaseButton text="간편장부 발급"/>
      </div>
    </div>
  );
}
