import OnlyLogoHeader from "@/components/header/only-logo-header/only-logo-header";
import classes from './layout.module.css';

export default function NoSidebarLayout({ children }) {
    return (
      <div className={classes.only_logo_layout}>
            
          <header className={classes.only_logo_header}>
              <OnlyLogoHeader />
          </header>
          
          <div className={classes.only_logo_main}>
              {children}  
          </div>
  
      </div>
    );
  }