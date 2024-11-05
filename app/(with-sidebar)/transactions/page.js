import Button from '@/components/button/button';
import classes from "./page.module.css";

export default function SalesExpenses() {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>매출과 지출 페이지</h1>
            <Button text="매출 추가" color="green" />
            <Button text="지출 추가" color="red" />
        </div>
    );
}