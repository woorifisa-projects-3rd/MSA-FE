import { 
    BsGraphUp, // 매출·지출
    BsCreditCard2Front, // 자동 이체 관리
    BsFileEarmarkText, // 급여 기록·명세서
    BsCalendarCheck, // 출·퇴근 기록
    BsPerson, // 직원 정보 관리
    BsPiggyBank, // 금융 상품 추천
    BsBoxArrowRight, // 로그아웃
} from 'react-icons/bs';

export const NAVIGATION_ITEMS = [
    {
        icon: BsGraphUp,
        title:"매출ㆍ지출",
        subTitles:[
            {text:"매출ㆍ지출 조회", path:"/transactions/analytics"}, 
            {text:"간편장부ㆍ손익계산서", path:"/transactions/reports"}
        ]
    },
    {
        icon: BsCreditCard2Front,
        title:"급여 자동이체",
        subTitles:[
            {text: "급여기록ㆍ 명세서 조회", path:"/payroll-auto-transfer/records"},
            {text: "급여 자동이체 관리", path:"/payroll-auto-transfer/management"}
        ]
    },
    {
        icon: BsCalendarCheck,
        title:"출ㆍ퇴근",
        subTitles:[
            {text:"직원 출ㆍ퇴근 캘린더", path:"/attendance/calendar"}, 
            {text:"당일 출근자 조회/수정", path:"/attendance/daily-attendance"}
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