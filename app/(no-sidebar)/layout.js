import GuestHeader from '@/components/header/guest-header/guest-header';
import classes from './layout.module.css';

export default function NoSidebarLayout({ children }) {
  return (
    <div className={classes.no_sidebar_layout}>
          
        <header className={classes.no_side_header}>
            <GuestHeader />
        </header>
        
        <div className={classes.no_side_main}>
            {children}  
        </div>

    </div>
  );
}
