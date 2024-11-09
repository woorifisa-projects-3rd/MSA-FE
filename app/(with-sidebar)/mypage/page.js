'use client'
import { useState } from "react";
import ProfileDetail from "../../../components/mypage/content/ProfileDetail";
import PasswordChange from "../../../components/mypage/content/PasswordChange";
import AlarmSetting from "@/components/mypage/content/AlarmSetting";
import classes from "./page.module.css";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  
  const renderTabContent = () => {
      switch(selectedTab) {
          case 0:
              return <ProfileDetail content={tabs[selectedTab]} />;
          case 1:
              return <AlarmSetting content={tabs[selectedTab]} />;
          case 2:
              return <PasswordChange content={tabs[selectedTab]} />;
          default:
              return null;
      }
  };

  return (
      <div className={classes.container}>
          <div className={classes.content}>
              <div>
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
              </div>
          </div>
      </div>
  );
}


const tabs = [
  { 
      name: '프로필 편집',
      email: 'alexarawles@gmail.com',
      workplaceInfo:[
        {
            name: '빅디빅',
            serialNumber: '#12548796',
            phoneNumber: '1002-850-391601',
            count: 3,
        },
        {
            name: '설명탕',
            serialNumber: '#12548796',
            phoneNumber: '1002-850-391601',
            count: 2,
        },
        {
            name: '먹투이',
            serialNumber: '#12548796',
            phoneNumber: '1002-850-391601',
            count: 1,
        }
      ]
  },
  { 
      name: '알림 설정',
      content: (
          <div>
              <h2>알림 설정 내용</h2>
          </div>
      )
  },
  { 
      name: '비밀번호 변경',
      content: (
          <div>
              <h2>비밀번호 변경 내용</h2>
          </div>
      )
  }
];
