'use client'
import { useEffect, useState } from "react";
import ProfileDetail from "../../../components/mypage/content/ProfileDetail";
import PasswordChange from "../../../components/mypage/content/PasswordChange";
import Loading from "@/components/loading/Loading";
import classes from "./page.module.css";
import { nextClient } from "@/lib/nextClient";
import Workplace from "@/components/mypage/content/Workplace";

const tabs = [
  { 
      name: '내 사업장',
  },
  { 
      name: '프로필 편집',
  },
  { 
      name: '비밀번호 변경',
  },
];


export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
//   const [stores, setStores] = useState([]);
//   const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
//   const [originalStore, setOriginalStore] = useState([]);



  const renderTabContent = () => {
      switch(selectedTab) {
          case 0:
              return <Workplace />;
          case 1:
              return <ProfileDetail />;
          case 2:
              return <PasswordChange content={tabs[selectedTab]} />;
          default:
              return null;
      }
  };

  return (
      <div className={classes.container}>
          <div className={classes.content}>
            {/* {loading && <Loading />} */}
            {error && <p className={classes.errorMessage}>에러: {error}</p>}
            { !error && (
                <>
                  <div className={classes.tabNavigation}>
                      <nav className={classes.tabList}>
                          {tabs.map((tab, index) => (
                              <button
                                  key={index}
                                  onClick={() => setSelectedTab(index)}
                                  className={`${classes.tabButton} ${
                                      selectedTab === index
                                          ? classes.tabButtonActive
                                          : classes.tabButtonInactive
                                  }`}
                              >
                                  {tab.name}
                              </button>
                          ))}
                      </nav>
                  </div>
                  <div className={classes.tabContent}>
                      {renderTabContent()}
                  </div>
                  </>
            )}
            </div>
        </div>
  );
}

