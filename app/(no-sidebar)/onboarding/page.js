'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function OnboardingPage() {
  const router = useRouter()

  const handleSignupClick = () => {
    router.push('/signup')
  }

  const handleWooriClick = () => {
    window.open('https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131', '_blank')
  }

  return (
      <div className={styles.container}>

        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>
                계좌를 연동하고<br />
                재무와 직원 관리를<br />
                <span className={styles.highlight}>한 번에</span> 해결하세요!
              </h1>
              <p>대한민국 소상공인/자영업자 사장님들을 위한<br/>단 하나의 통합 플랫폼</p>
              <div className={styles.buttonGroup}>
                <button
                    className={styles.primaryButton}
                    onClick={handleSignupClick}
                >
                  기존 계좌로 회원가입
                </button>
                <button
                    className={styles.secondaryButton}
                    onClick={handleWooriClick}
                >
                  우리은행 계좌 만들러가기
                </button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                  src="/images/dashboard.png"
                  alt="대시보드 미리보기"
                  width={550}
                  height={400}
                  className={styles.dashboardImage}
              />
            </div>
          </section>

          <section className={styles.features}>
            <h2>집계사장에서는 이 모든 게 무료로 가능해요!</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📆</div>
                <p>직원의 출퇴근을 자동으로 관리하고, 캘린더로 조회할 수 있어요</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💸</div>
                <p>따로 이체할 필요 없어요!<br/>매달 정해진 날짜에 자동으로 급여가 이체 돼요</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📃</div>
                <p>급여 이체와 동시에 자동으로 직원에게 급여명세서를 보내 드려요</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔍</div>
                <p>가계의 매출과 지출을 한 눈에 조회하고, 문서로 받아볼 수 있어요</p>
              </div>
            </div>
            <button className={styles.moreButton} onClick={handleSignupClick}>무료로 시작하기</button>
          </section>

          <section className={styles.recommendations}>
            <h2>집계사장을 이런 사장님들께 추천해요!</h2>
            <div className={styles.recommendList}>
              <p>매달 계산기 두들겨 계산하느라 머리가 복잡하셨던 사장님</p>
              <p>급여 명세서 작성과 발송이 귀찮으셨던 사장님</p>
              <p>가게의 매출과 지출을 머리로 대충 짐작하셨던 사장님</p>
              <p>매달 직원 한 명씩 급여 이체하기가 번거로우셨던 사장님</p>
              <p>가게의 재무 상황을 문서로 보고 싶으셨던 사장님</p>
            </div>
            <button className={styles.startButton} onClick={handleSignupClick}>계좌 등록하고 고민 해결</button>
          </section>
        </main>
      </div>
  )
}