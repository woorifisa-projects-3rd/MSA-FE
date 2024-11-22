'use client';
import { nextClient } from "@/lib/nextClient";
import styles from "./attendance-modal-body.module.css";
import { useState, useEffect } from "react";

export default function AttendanceModalBody({
    mode="create",
    attendanceData={},
    onChange 
}){
      const [formData, setFormData] = useState({
        storeemployeeId: '',
        date: '',
        startTime: '',
        endTime: ''
      });

      const [employees, setEmployees] = useState([]);

      // const [workHours, setWorkHours] = useState('총 근무시간: ');

      useEffect(() => {
        // Fetch employees data from API
        const fetchEmployees = async () => {
            try {
                const response = await nextClient.get(`/employee/details?storeid=1`);
                const data = await response.data;

                console.log("storeid별 직원 정보 조회 응답",response.data)
                // Map the response to only include storeemployeeId and name
                const mappedEmployees = data.map((employee) => ({
                    storeemployeeId: employee.id,
                    name: employee.name,
                }));

                setEmployees(mappedEmployees); // Update the employees state
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
      }, []); // Fetch employees only once when the component is mounted


      useEffect(() => {
        if (mode === "edit" && attendanceData) {
          setFormData(attendanceData);
        }
      }, [mode, attendanceData]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };

        setFormData(updatedData);

        // console.log("attendance-modal-body에서 updatedData:", updatedData);
    
        if (onChange && JSON.stringify(formData) !== JSON.stringify(updatedData)) {
          onChange(updatedData);
        }
      };


    return (
        <div className={styles.container}>
            <form className={styles.form} >
                <div className={styles.formGroup}>
                  <select 
                      name="storeemployeeId"
                      value={formData.storeemployeeId}
                      onChange={handleChange}
                      className={styles.select}
                  >
                      <option value="">직원명</option>
                      {employees.map((employee) => (
                      <option key={employee.storeemployeeId} value={employee.storeemployeeId}>
                          {employee.name}
                      </option>
                      ))}
                  </select>
                </div>
    
                <div className={styles.formGroup}>
                  <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={styles.dateInput}
                     // attendance값이 있다면 default값 넣기 
                    //  defaultValue={attendanceData?.date}

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
                            // attendance값이 있다면 default값 넣기
                            defaultValue={attendanceData?.startTime}
                            

                        />
                        <span className={styles.timeLabel} data-type="start">출근</span>
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <input 
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            // attendance값이 있다면 default값 넣기 
                            onChange={handleChange}
                            className={styles.timeInput}
                        />
                        <span className={styles.timeLabel} data-type="end">퇴근</span>
                      </div>
                  </div>
                </div>
    
                {/* <div className={styles.formGroup}>
                  <div className={styles.workHoursText}>
                      {workHours}
                  </div>
                </div> */}
                
            </form>
        </div>
    )
}