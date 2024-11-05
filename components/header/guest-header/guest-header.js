import classes from "./header.module.css";
import Link from 'next/link';



export default function GuestHeader () {
    return (
        <header className={classes.header_container}>
            <div className={classes.header_left}>
            <img src="/집계사장.png" alt="로고" className={classes.logo_image} />
            </div>
            <div className={classes.header_right}>
                <Link href="/login">
                    <button className={classes.profile_button}>로그인</button>
                </Link>
                <Link href="/signup">
                    <button className={classes.profile_button}>회원가입</button>
                </Link>
            </div>
        </header>
    )
}