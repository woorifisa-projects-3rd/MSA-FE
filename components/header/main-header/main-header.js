import classes from "./header.module.css";
import { FiBell } from "react-icons/fi";


export default function Header () {
    return (
        <header className={classes.header_container}>
            <div className={classes.header_left}>
            <img src="/logo.png" alt="로고" className={classes.logo_image} />
            </div>
            <div className={classes.header_right}>
                <button className={classes.profile_button}>내 정보</button>
                <div>
                <FiBell size={45} className={classes.bell_icon} /> {/* 알람 아이콘 */}
                </div>
            </div>
        </header>
    )
}