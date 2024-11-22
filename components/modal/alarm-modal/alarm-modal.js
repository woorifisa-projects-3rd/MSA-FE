import styles from './alarm-modal.module.css';

export default function AlarmModal({ modalRef, notifications }) {

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
