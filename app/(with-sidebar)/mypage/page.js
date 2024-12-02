'use client'
import { useEffect, useState } from "react";
import ProfileDetail from "../../../components/mypage/content/ProfileDetail";
import PasswordChange from "../../../components/mypage/content/PasswordChange";
import AlarmSetting from "@/components/mypage/content/AlarmSetting";
import Loading from "@/components/loading/Loading";
import classes from "./page.module.css";
import { nextClient } from "@/lib/nextClient";

const tabs = [
  { 
      name: '프로필 편집',
  },
  { 
      name: '비밀번호 변경',
      content:'비밀번호 변경 내용'
  }
];


export default function Home() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStores = async () => {
    
    setLoading(true);
    setError(null);
    try {
        const response = await nextClient.get('/mypage/store/storelist');
        console.log(response)
        const transformedStores = response.data.map(store => ({
            storeId: store.id,
            storeName: store.storeName,
            businessNumber: store.businessNumber,
            accountNumber: store.accountNumber,
            bankCode: store.bankCode,
            location: store.location,
        }));
        
        setStores(transformedStores);
    } catch (error) {
        console.error("가게 데이터를 가져오는데 실패했습니다.");
        setError(error.response?.data?.error || error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const renderTabContent = () => {
      switch(selectedTab) {
          case 0:
              return <ProfileDetail content={stores} refreshStores={stores}/>;
        //   case 1:
        //       return <AlarmSetting content={tabs[selectedTab]} />;
          case 1:
              return <PasswordChange content={tabs[selectedTab]} />;
          default:
              return null;
      }
  };

  return (
      <div className={classes.container}>
          <div className={classes.content}>
            {loading && <Loading />}
            {error && <p className={classes.errorMessage}>에러: {error}</p>}
            {!loading && !error && (
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




