'use client';

import React, { useState } from "react";
// import { IoIosArrowForward } from "react-icons/io";

import classes from "./navigation.module.css";
import Link from "next/link";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import { BsBoxArrowRight } from "react-icons/bs";
import BusinessSelectDropdown from "../dropdown/business-dropdown";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import { authApi } from "@/lib/auth";

export default function Navigation(){
    const router = useRouter();
    const { logout } = useAuth(); // AuthContext에서 logout 함수 가져오기
    
    const [activeIndex, setActiveIndex] = useState();

    const handleLogout = async() => {
        try{
            // await authApi.logout(); // 스프링 서버에 로그아웃 알림
            await logout();   //next.js 서버를 통해 브라우저에 저장된 쿠키 삭제 &  클라이언트 상태 초기화 
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
                onClick={handleLogout}
                className={classes.logout}
            >
                <div>로그아웃</div>
                <div><BsBoxArrowRight /></div>
            </button>
        </nav>
    )
}