'use client';

import classes from "./main-header.module.css";
import { FiBell } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";
import AlarmModal from "@/components/modal/alarm-modal/alarm-modal";
import { useState, useEffect, useRef } from "react";


export default function MainHeader () {
    const [isAlarmOpen, setIsAlarmOpen] = useState(false);
    const bellRef = useRef();
    const modalRef = useRef();
    const logoWidth = 250;
    const pathname = usePathname();

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
            <div className={classes.header_left}>
                <Link href="/onboarding">
                    <Image className={classes.logoBox} src="/images/logo.png" alt="집계사장" width={logoWidth} height={logoWidth * 0.26}/>
                </Link>
            </div>
            <div className={classes.headerRight}>
                
                <div className={classes.headerTitle}>{getCurrentPagetTile()}</div>
                
                <div className={classes.headerMenu}>
                    <button className={classes.profile_button}>내 정보</button>
                    <div ref={bellRef} className={classes.bellContainer}>
                        <FiBell
                            size={45}
                            className={classes.bell_icon}
                            onClick={handleBellClick}
                        />
                        {isAlarmOpen && (
                            <AlarmModal modalRef={modalRef} />
                        )}
                    </div>
                </div>
                
            </div>
        </header>
    )
}