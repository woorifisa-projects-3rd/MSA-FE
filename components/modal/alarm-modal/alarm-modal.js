import styles from './alarm-modal.module.css';

const notifications = [
    { id: 1, location: "빽다방 상암점", time: "오전 08:50", message: "정성윤 님이 출근하셨습니다." },
    { id: 2, location: "짜글짜글 대치점", time: "오전 08:45", message: "이현아 님이 출근하셨습니다." },
    { id: 3, location: "짜글짜글 대치점", time: "오전 07:30", message: "이현아 님 외 10명 자동이체 되었습니다." },
    { id: 4, location: "메머드커피 신사점", time: "오전 09:15", message: "류혜리 님이 출근하셨습니다." },
    { id: 5, location: "마마된장 상암점", time: "오전 09:00", message: "강세필 님이 괴로워 하십니다." },
];

export default function AlarmModal({ modalRef }) {

  return (
    <div ref={modalRef} id="notification-modal" className={styles.notificationModal}>
      <div className={styles.notificationHeader}>
        <span>알람 설정</span>
        <label className={styles.switch}>
          <input type="checkbox" defaultChecked />
          <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
      </div>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li key={notification.id} className={styles.notificationItem}>
            <span className={styles.storeName}>{notification.location}</span>
            <span className={styles.time}>{notification.time}</span>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
