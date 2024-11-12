"use client"
import Button from '@/components/button/button';
import classes from "./page.module.css";
import DefaultTable from '@/components/table/DefaultTable';
import ModalContainer from '@/components/modal/modal-container';

const modify = "수정";
const del = "삭제";

export default function SalesExpenses() {
    const tableHeaders = {
        name: "직원 이름",
        phone: "전화번호",
        birthDate: "생년월일",
        address: "주소",
        modify: "수정",
        delete: "삭제"
    };

    const list = [
        {
            name: "정성운",
            phone: "(225) 555-0118",
            birthDate: "2000/06/20",
            address: "서울 반포 블로자이"
            
        },
        {
            name: "이한미",
            phone: "(225) 555-0118",
            birthDate: "2000/06/20",
            address: "성수동 트리마제"
        },
        {
            name: "류혜리",
            phone: "(225) 555-0118",
            birthDate: "2000/06/20",
            address: "한남동 나인원한남"
        },
        {
            name: "임지혁",
            phone: "(225) 555-0118",
            birthDate: "2000/06/20",
            address: "두꺼비집"
        },
        {
            name: "박준혁",
            phone: "(823) 555-0129",
            birthDate: "2000/06/20",
            address: "소나무 자재집"
        },
        {
            name: "김수빈",
            phone: "(225) 555-0118",
            birthDate: "2000/06/20",
            address: "홍대 개미"
            
        }
    ];

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>직원 정보 조회/수정 페이지</h1>
        
            <Button text= "직원 추가" color={"var(--main-woori-blue)"} />
            <DefaultTable tableName="직원정보 관리" tableHeaders={tableHeaders} list={list} />
        </div>
    );
}