import classes from "./only-logo-header.module.css";
import Image from "next/image";

export default function OnlyLogoHeader () {
    const logoWidth = 150;

    return (
        <header className={classes.header_box}>
            <div className={classes.header_container}>
                <div className={classes.header_left}>
                    <Image 
                        className={classes.logoBox} 
                        src="/images/logo.png" 
                        alt="집계사장" 
                        width={logoWidth}
                        height={logoWidth * 0.26}
                        priority
                    />
                </div>
            </div>
            
        </header>
    )
}