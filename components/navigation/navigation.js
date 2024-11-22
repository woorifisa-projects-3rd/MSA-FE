'use client';

import React, { useState } from "react";
// import { IoIosArrowForward } from "react-icons/io";

import classes from "./navigation.module.css";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import { BsBoxArrowRight } from "react-icons/bs";
import BusinessSelectDropdown from "../dropdown/business-dropdown";
import { useRouter } from 'next/navigation';

export default function Navigation(){
    const router = useRouter();
    
    const [activeIndex, setActiveIndex] = useState();

    // 나중에 처리 
    const handleLogout = async() => {
        try{
            router.push('/login'); // 로그인 페이지로 리다이렉트 
        }catch (error) {
            console.error('로그아웃 실패:', error);
        }
    }

     // 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleNavigation = (path, getDynamicPath) => {
        if (getDynamicPath) {
            router.push(`/attendance/daily-attendance?date=${getTodayDate()}`);
        } else {
            router.push(path);
        }
    };


    return (
        <nav className={classes.nav}>
            {/* 상단 드롭다운 섹션 */}
            <div className={classes.topSection}>
                <BusinessSelectDropdown/>
            </div>

            {/* 메인 네비게이션 섹션  */}
            <div className={classes.navigationSection}>
                <ul>
                    {NAVIGATION_ITEMS.map((item, index)=>(
                        <li 
                            key={index}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {/* 메인 카테고리 */}
                            <div className={`${classes.mainItemBox} ${activeIndex === index ? classes.active : ''}`}>
                                {item.icon && <item.icon className={classes.icon} />}
                                <div>{item.title}</div>
                            </div>

                            {activeIndex === index && item.subTitles && (
                                <div className={classes.subMenuBox}>
                                    {item.subTitles.map((subTitle, subIndex)=>(
                                        <li 
                                            key={subIndex} 
                                            className={classes.subMenuItem}
                                            onClick={() => handleNavigation(subTitle.path, subTitle.isDailyAttendance)}
                                        >
                                            <div className={classes.subMenuItemLink}>
                                                {subTitle.text}
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 로그아웃 섹션 */}
            <button 
                className={classes.logout}
            >
                <div>로그아웃</div>
                <div><BsBoxArrowRight /></div>
            </button>
        </nav>
    )
}