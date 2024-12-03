'use client';

import React, { useState } from "react";
import classes from "./navigation.module.css";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import { BsBoxArrowRight } from "react-icons/bs";
import BusinessSelectDropdown from "../dropdown/business-dropdown";
import { useRouter } from "next/navigation";
import { nextClient } from "@/lib/nextClient";

export default function Navigation({ isMobileMenuOpen }) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    const handleLogout = async() => {
        try{
            await nextClient.get('/auth/logout');
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
        <>
            {/* 데스크톱 네비게이션 */}
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
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                className={classes.navigationItem}
                            >
                                {/* 메인 카테고리 */}
                                <div className={`${classes.mainItemBox} ${activeIndex === index ? classes.active : ''}`}>
                                    {item.icon && <item.icon className={classes.icon} />}
                                    <div>{item.title}</div>
                                </div>
                                <div
                                    className={`${classes.subMenuBox} ${
                                        activeIndex === index ? classes.subMenuOpen : ""
                                    }`}
                                >
                                    {item.subTitles &&
                                        item.subTitles.map((subItem, subIndex) => (
                                            <div
                                                key={subIndex}
                                                className={classes.subMenuItem}
                                                onClick={() =>
                                                    handleNavigation(
                                                        subItem.path,
                                                        subItem.isDailyAttendance
                                                    )
                                                }
                                            >
                                                {subItem.text}
                                            </div>
                                        ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* 로그아웃 섹션 */}
                <button 
                    className={classes.logout}
                    onClick={handleLogout}
                >
                    <div>로그아웃</div>
                    <div className={classes.icon}><BsBoxArrowRight /></div>
                </button>
            </nav>

             {/* 모바일 네비게이션 */}
            <div className={`${classes.mobileNav} ${isMobileMenuOpen ? classes.open : ''}`}>
                <div className={classes.mobileNavContent}>
                    {/* 상단 드롭다운 섹션 */}
                    <div className={classes.mobileTopSection}>
                        <BusinessSelectDropdown/>
                    </div>

                    {/* 메인 네비게이션 섹션 */}
                    <div className={classes.mobileNavigationSection}>
                        <ul>
                            {NAVIGATION_ITEMS.map((item, index) => (
                                <li key={index}>
                                    <button 
                                        className={classes.mobileMenuItem}
                                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    >
                                        {item.icon && <item.icon className={classes.mobileIcon} />}
                                        <span>{item.title}</span>
                                    </button>
                                    
                                    {activeIndex === index && item.subTitles && (
                                        <div className={classes.mobileSubMenu}>
                                            {item.subTitles.map((subTitle, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    className={classes.mobileSubMenuItem}
                                                    onClick={() => handleNavigation(subTitle.path, subTitle.isDailyAttendance)}
                                                >
                                                    {subTitle.text}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 로그아웃 버튼 */}
                    <button 
                        className={classes.mobileLogout}
                        onClick={handleLogout}
                    >
                        <span>로그아웃</span>
                        <BsBoxArrowRight className={classes.icon}/>
                    </button>
                </div>
            </div>

        </>
    
    )
}