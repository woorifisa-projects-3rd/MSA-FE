import { useEffect } from "react";

useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`);
      let end = new Date(`2024-01-01T${formData.endTime}:00`);
      
      if (end < start) {
        end = new Date(`2024-01-02T${formData.endTime}:00`);
      }
      
      const diff = end - start;

      // 유효하지 않은 값은 처리하지 않음
      if (isNaN(diff)) return;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const timeFormat = `${formattedHours}:${formattedMinutes}:00`;

      // workTime이 변경된 경우에만 상태 업데이트
      if (formData.workTime !== timeFormat) {
        const updatedData = { ...formData, workTime: timeFormat };
        setFormData(updatedData);

        // 부모 컴포넌트로 변경된 데이터 전달
        if (onChange) {
          onChange(updatedData);
        }
      }
      
      // if (hours === 0) {
      //   setWorkHours(`총 근무시간: ${minutes}분`);
      // } else if (minutes === 0) {
      //   setWorkHours(`총 근무시간: ${hours}시간`);
      // } else {
      //   setWorkHours(`총 근무시간: ${hours}시간 ${minutes}분`);
      // }
    }
  }, [formData.startTime, formData.endTime, formData.workTime, onChange]);
