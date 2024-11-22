/**
 * 현재 날짜를 YYYY-MM-DD 형식의 문자열로 반환
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * 주어진 Date 객체를 YYYY-MM-DD 형식의 문자열로 반환
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
 * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
 * @returns {Date} 변환된 Date 객체
 */
export const parseDate = (dateString) => {
    return new Date(dateString);
};