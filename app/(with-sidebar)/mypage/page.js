'use client'
import { useEffect, useState } from "react";
import ProfileDetail from "../../../components/mypage/content/ProfileDetail";
import PasswordChange from "../../../components/mypage/content/PasswordChange";
import AlarmSetting from "@/components/mypage/content/AlarmSetting";
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
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalStore, setOriginalStore] = useState([]);

  const fetchStores = async () => {
    
    setLoading(true);
    setError(null);
    try {
        const response = await nextClient.get('/mypage/store/storelist');
        setOriginalStore(response.data);
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

  console.log("서버에서 받은 original list", originalStore)
  const renderTabContent = () => {
      switch(selectedTab) {
          case 0:
              return <Workplace content={stores} fetchStores={fetchStores} originalStore={originalStore}/>;
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

