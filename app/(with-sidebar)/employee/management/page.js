import Button from '@/components/button/button';
import classes from "./page.module.css";
import Link from 'next/link';

export default function SalesExpenses() {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>직원 정보 조회 페이지</h1>
            <button>
                <Link href="/employee/management/employee-add">
                    직원 추가하기
                </Link>
            </button>
        </div>
    );
}