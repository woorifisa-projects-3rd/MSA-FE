'use client'

import MainHeader from "@/components/header/main-header/main-header";
import classes from "./layout.module.css";
import Navigation from "@/components/navigation/navigation";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthProvider";

export default function WithSidebarLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <AuthProvider>
      <div className={classes.layoutContainer}>
          
          <header className={classes.header}>
              <MainHeader 
                isMobileMenuOpen={isMobileMenuOpen} 
                onMenuToggle={handleMenuToggle} 
              />
          </header>
          
          <aside className={classes.sidebar}>
              <Navigation isMobileMenuOpen={isMobileMenuOpen}  />
          </aside>
          
          <div className={classes.main}>
            {children}  
          </div>
  
      </div>
    </AuthProvider>
  
  );
}
