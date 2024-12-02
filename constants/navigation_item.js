import { 
    BsGraphUp, // 매출·지출
    BsCreditCard2Front, // 자동 이체 관리
    BsFileEarmarkText, // 급여 기록·명세서
    BsCalendarCheck, // 출·퇴근 기록
    BsPerson, // 직원 정보 관리
    BsPiggyBank, // 금융 상품 추천
    BsBoxArrowRight, // 로그아웃
} from 'react-icons/bs';

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const NAVIGATION_ITEMS = [
    {
        icon: BsGraphUp,
        title:"매출ㆍ지출",
        subTitles:[
            {text:"매출ㆍ지출 조회", path:"/transactions/analytics"}, 
            // {text:"간편장부ㆍ손익계산서", path:"/transactions/reports"}
        ]
    },
    {
        icon: BsCreditCard2Front,
        title:"급여 자동이체",
        subTitles:[
            {text: "급여기록ㆍ 명세서 조회", path:"/payroll-auto-transfer/records"},
        ]
    },
    {
        icon: BsCalendarCheck,
        title:"출ㆍ퇴근",
        subTitles:[
            {text:"직원 출ㆍ퇴근 캘린더", path:"/attendance/calendar"}, 
            {
                text:"당일 출근자 조회/수정", 
                path:"/attendance/daily-attendance",
                isDailyAttendance: true // 이 플래그로 특별 처리가 필요한 항목 구분
            }
        ]
    },
    {
        icon: BsPerson,
        title:"직원관리",
        subTitles:[
            {text:"직원 정보 조회/수정", path:"/employee/management"}, 
        ]
        
    },
    {
        icon:BsPiggyBank,
        title:"금융 상품",
        subTitles:[
            {text:"금융 상품 추천", path:"/financial-products"}
        ]
    }

];