'use client'

import Button from "@/components/button/button";
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import MonthSelector from "@/components/selector/selector";
import { useState } from 'react';

const buttonText = "확인";

export default function SalesExpenses() {

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleMonthChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const [list, setList] = useState([
        { name: '정성윤', account: '110-123456-45687', amount: '266,000원', date: '2024/10/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
        { name: '이현아', account: '213-151-1223165', amount: '309,210원', date: '2024/11/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
        { name: '류혜리', account: '111-15795-246821', amount: '309,210원', date: '2024/09/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
        { name: '임지혁', account: '258-1467-284567', amount: '309,210원', date: '2024/10/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
        { name: '박준현', account: '258-1467-284567', amount: '309,210원', date: '2024/10/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
        { name: '강세필', account: '258-1467-284567', amount: '309,210원', date: '2024/10/03', button: <Button text={buttonText} color="var(--main-woori-blue)" /> },
    ]);

    // 선택된 월에 맞는 데이터 필터링
    const filteredList = list.filter(item => {
        const itemDate = new Date(item.date);
        return (
            itemDate.getFullYear() === selectedDate.getFullYear() &&
            itemDate.getMonth() === selectedDate.getMonth()
        );
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
            <DefaultTable 
                tableName={<MonthSelector onMonthChange={handleMonthChange} />} 
                tableHeaders={tableHeaders} 
                list={filteredList} 
            />
        </div>
    );
}