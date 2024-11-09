import AccountInput from "@/components/input/account-input";

export default function AccountTestPage() {
 return (
   <div className="p-4">
     <h1 className="text-2xl mb-4">계좌 입력 테스트</h1>
     
     <div className="space-y-8">
       {/* 일반 계좌 입력 */}
       <div>
         <h2 className="text-lg font-medium mb-2">일반 계좌 입력</h2>
         <AccountInput />
       </div>

       {/* 우리은행 전용 계좌 입력 */}
       <div>
         <h2 className="text-lg font-medium mb-2">우리은행 전용 계좌 입력</h2>
         <AccountInput isPresident={true} />
       </div>
     </div>

     <div className="mt-8 p-4 bg-gray-50 rounded-lg">
       <h3 className="font-medium mb-2">설명:</h3>
       <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
         <li>일반 계좌 입력: 모든 은행 선택 가능</li>
         <li>우리은행 전용: 우리은행으로 고정, 은행 변경 불가</li>
       </ul>
     </div>
   </div>
 );
}