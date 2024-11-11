'use client';

import classes from "./main-header.module.css";
import { FiBell } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/constants/navigation_item";


export default function MainHeader () {
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
                    <FiBell size={45} className={classes.bell_icon} />
                </div>
                
            </div>
        </header>
    )
}