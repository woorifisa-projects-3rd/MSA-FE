'use client';
import { useState, useEffect } from "react";
import { nextClient } from "@/lib/nextClient";
import styles from "./attendance-modal-body.module.css";
import { useAuth } from "@/contexts/AuthProvider";

export default function AttendanceModalBody({
  mode,
  attendanceData = {},
  error,
  onChange,
  onConfirm,
}) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [employees, setEmployees] = useState([]);
  const [totalWorkTime, setTotalWorkTime] = useState(null); // 총 근무시간 상태
  const {storeId} = useAuth();

  // 직원 목록 가져오기 - create 모드일 때만
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await nextClient.get(`/employee/details?storeid=${storeId}`);
        const data = await response.data;
        const mappedEmployees = data.map((employee) => ({
          storeemployeeId: employee.id,
          name: employee.name,
          employmentType: employee.employmentType
        }));
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    if (mode === "create") {
      fetchEmployees();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && attendanceData) {
      setFormData({
        name: attendanceData.name || "",
        date: attendanceData.commuteDate || attendanceData.date || "",
        startTime: attendanceData.startTime || "",
        endTime: attendanceData.endTime || "",
        commuteId: attendanceData.commuteId || "",
      });

      validateAndCalculateWorkTime(attendanceData.startTime, attendanceData.endTime);
    }
  }, [mode, attendanceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData);

    // 유효성 검사 후 근무 시간 계산
    if (name === "startTime" || name === "endTime") {
      validateAndCalculateWorkTime(updatedData.startTime, updatedData.endTime);
    }

    if (onChange) {
      onChange(updatedData);
    }
  };

  const validateAndCalculateWorkTime = (start, end) => {
    if (start && end) {
      const startTime = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
  
      // endTime이 startTime보다 빠르면 24시간을 더해줍니다.
      if (endTime <= startTime) {
        endTime.setHours(endTime.getHours() + 24); // 24시간 추가
      }
  
      const diffInMs = endTime - startTime; // 밀리초 단위 차이
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // 시간 계산
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60)); // 분 계산
  
      setTotalWorkTime(`${diffInHours}시간 ${diffInMinutes}분`);
    } else {
      setTotalWorkTime(null); // 값이 비어 있으면 초기화
    }
  };
  

  return (
    <div className="space-y-4">
      <div className={styles.container}>
        <form className={styles.form}>
          {mode === "create" ? (
            <div className={styles.formGroup}>
              <select
                name="storeemployeeId"
                value={formData.storeemployeeId}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">직원명</option>
                {employees
                .filter((employee) => employee.employmentType !== 10 && employee.employmentType !== 11)
                .map((employee) => (
                  <option
                    key={employee.storeemployeeId}
                    value={employee.storeemployeeId}
                  >
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className={styles.formGroup}>
              <select
                name="storeemployeeId"
                value={formData.storeemployeeId}
                disabled
                className={`${styles.select} ${styles.disabledInput}`}
              >
                <option value="">{formData.name || "직원명"}</option>
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.timeInputs}>
              <div className={styles.inputGroup}>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={styles.timeInput}
                />
                <span className={styles.timeLabel} data-type="start">
                  출근
                </span>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={styles.timeInput}
                />
                <span className={styles.timeLabel} data-type="end">
                  퇴근
                </span>
              </div>
            </div>
          </div>

          {totalWorkTime && (
            <div className={styles.totalWorkTime}>
              총 근무시간: <span>{totalWorkTime}</span>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
