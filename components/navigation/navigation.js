'use client';

import React, { useState } from "react";
// import { IoIosArrowForward } from "react-icons/io";

import classes from "./navigation.module.css";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import { BsBoxArrowRight } from "react-icons/bs";
import BusinessSelectDropdown from "../dropdown/business-dropdown";
import { useRouter } from 'next/navigation';
import { nextClient } from "@/lib/nextClient";

export default function Navigation(){
    const router = useRouter();
    
    const [activeIndex, setActiveIndex] = useState();

    const handleLogout = async() => {
        try{
            await nextClient.get('/auth/logout');
            router.push('/login'); // 로그인 페이지로 리다이렉트 
        }catch (error) {
            console.error('로그아웃 실패:', error);
        }
    }


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

                            {/* 메인 카테고리에 따른 세부 카테고리 */}
                            {activeIndex === index && item.subTitles && (
                                <div className={classes.subMenuBox}>
                                    {item.subTitles.map((subTitle, subIndex)=>(
                                        <li key={subIndex} className={classes.subMenuItem}>
                                            <Link className={classes.subMenuItemLink} href={subTitle.path}>
                                                {subTitle.text}
                                            </Link>
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
                onClick={handleLogout}
            >
                <div>로그아웃</div>
                <div><BsBoxArrowRight /></div>
            </button>
        </nav>
    )
}