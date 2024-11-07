import MainHeader from "@/components/header/main-header/main-header";
import classes from "./layout.module.css";
import Navigation from "@/components/navigation/navigation";

export default function WithSidebarLayout({ children }) {
  return (
    <div className={classes.layoutContainer}>
          
        <header className={classes.header}>
            <MainHeader />
        </header>
        
        <aside className={classes.sidebar}>
            <Navigation />
        </aside>
        
        <div className={classes.main}>
          {children}  
        </div>

    </div>
  );
}
