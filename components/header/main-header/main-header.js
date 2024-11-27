'use client';

import classes from "./main-header.module.css";
import { FiBell } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import AlarmModal from "@/components/modal/alarm-modal/alarm-modal";
import { useState, useEffect, useRef } from "react";
import { Menu, Bell, X } from 'lucide-react';

const initialNotifications = [
    { id: 1, location: "빽다방 상암점", time: "오전 08:50", message: "정성윤 님이 출근하셨습니다." },
    { id: 2, location: "짜글짜글 대치점", time: "오전 08:45", message: "이현아 님이 출근하셨습니다." },
    { id: 3, location: "짜글짜글 대치점", time: "오전 07:30", message: "이현아 님 외 10명 자동이체 되었습니다." },
    { id: 4, location: "메머드커피 신사점", time: "오전 09:15", message: "류혜리 님이 출근하셨습니다." },
    { id: 5, location: "마마된장 상암점", time: "오전 09:00", message: "정성윤 바보" },
];

export default function MainHeader ({ isMobileMenuOpen, onMenuToggle }) {
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const bellRef = useRef();
    const modalRef = useRef();
    const logoWidth = 250;
    const pathname = usePathname();
    
   

    // 읽지 않은 알림의 개수
    const unreadNotificationCount = notifications.filter(notification => !notification.read).length;

    // 현재 경로에 해당하는 타이틀을 찾는 함수
    const getCurrentPagetTile = () => {
        for (const item of NAVIGATION_ITEMS) {
            for (const sub of item.subTitles) {
                if (sub.path === pathname) {
                    return sub.text;
                }
            }
        } 
        return ""; // 기본값
    };

    const handleBellClick = () => {
        setIsAlarmOpen(prev => !prev);

        // 알람 모달을 열면 1.5초 뒤에 알림을 읽음으로 표시
        if (!isAlarmOpen) {
            setTimeout(() => {
                setNotifications(prevNotifications => 
                    prevNotifications.map(notification => ({
                        ...notification,
                        read: true
                    }))
                );
            }, 1500);
        }
    };

    // 모달 외부를 클릭했을 때 모달을 닫는다
    const handleClickOutside = (event) => {
        if (
            bellRef.current &&
            !bellRef.current.contains(event.target) &&
            modalRef.current &&
            !modalRef.current.contains(event.target)
        ) {
            setIsAlarmOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // 모달이 열려 있을 때 외부 스크롤 막기
    /*
    useEffect(() => {
        if (isAlarmOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isAlarmOpen]);
    */
    
    return (
        <header className={classes.header_container}>
            {/* 데스크톱 헤더 */}
            <div className={classes.desktopHeader}>
                <div className={classes.header_left}>
                    <Link href="/onboarding" style={{zIndex:100000}}>
                        <Image className={classes.logoBox} src="/images/logo.png" alt="집계사장" width={logoWidth} height={logoWidth * 0.26} priority />
                    </Link>
                </div>
                <div className={classes.headerRight}>
                    
                    <div className={classes.headerTitle}>{getCurrentPagetTile()}</div>
                    
                    <div className={classes.headerMenu}>
                        <Link href="/mypage">
                            <button className={classes.profile_button}>내 정보</button>
                        </Link>
                        <div ref={bellRef} className={classes.bellContainer}>
                            <FiBell
                                size={45}
                                className={classes.bell_icon}
                                onClick={handleBellClick}
                            />
                            {unreadNotificationCount > 0 && (
                                <span className={classes.notificationCnt}>
                                    {unreadNotificationCount}
                                </span>
                            )}
                            {isAlarmOpen && (
                                <AlarmModal modalRef={modalRef} notifications={notifications} />
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
      

            {/* 모바일 헤더 */}
            <div className={classes.mobileHeader}>
                <div className={classes.mobileLeft}>
                    <Link href="/" className={classes.mobileLogo}>
                        <Image 
                            className={classes.logoBox} 
                            src="/images/logo.png" 
                            alt="집계사장" 
                            width={logoWidth}
                            height={logoWidth * 0.26}
                            priority
                        />
                    </Link>
                </div>
              
                <div className={classes.mobileRight}>
                    <Link href="/mypage">
                        <button className={classes.profile_button}>내 정보</button>
                    </Link>
                    {/* <button className={classes.bellButton}>
                        <Bell className={classes.bellIcon} />
                        <span className={classes.notificationCount}>5</span>
                    </button> */}
                    <div ref={bellRef} className={classes.bellContainer}>
                        <FiBell
                            size={45}
                            className={classes.bell_icon}
                            onClick={handleBellClick}
                        />
                        {unreadNotificationCount > 0 && (
                            <span className={classes.notificationCnt}>
                                {unreadNotificationCount}
                            </span>
                        )}
                        {isAlarmOpen && (
                            <AlarmModal modalRef={modalRef} notifications={notifications} />
                        )}
                    </div>
                    <button 
                        className={classes.menuButton}
                        onClick={onMenuToggle}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu className={classes.menuIcon} />}
                    </button>
                </div>
            </div>
        </header>
    )
}