import classes from "./guest-header.module.css";
import Link from 'next/link';
import Image from "next/image";

export default function GuestHeader () {
    const logoWidth = 240;

    return (
        <header className={classes.header_box}>
            <div className={classes.header_container}>
                <div className={classes.header_left}>
                    <Link href="/onboarding">
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
                <div className={classes.header_right}>
                    
                    <Link href="/login">
                        <button className={classes.profile_button}>로그인</button>
                    </Link>
                    <Link href="/signup">
                        <button className={classes.profile_button}>회원가입</button>
                    </Link>
                </div>
            </div>
            
        </header>
    )
}