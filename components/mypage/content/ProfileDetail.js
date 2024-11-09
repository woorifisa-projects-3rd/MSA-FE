// PageProfileDetail.js
'use client'
import classes from './ProfileDetail.module.css';

export default function ProfileDetail({content}) {
    const name =content.name;
    const email =content.email;
    const workplaceInfo =content.workplaceInfo;
   return (
       <div className={classes.container}>
           <div className={classes.headerSection}>
               <h2 className={classes.title}>{name} 사장님</h2>
               <div className={classes.email}>{email}</div>
           </div>

           <div className={classes.otherComponent}>여기는 다른 컴포넌트</div>

           <div>
               <h3 className={classes.workplaceTitle}>보유하신 사업장</h3>
               <table className={classes.table}>
                   <thead className={classes.tableHeader}>
                       <tr className={classes.headerRow}>
                           <th className={classes.headerCell}>사업장 상호명</th>
                           <th className={classes.headerCell}>사업자 번호</th>
                           <th className={classes.headerCell}>계좌번호</th>
                           <th className={`${classes.headerCell} ${classes.centerAlign}`}>직원 수</th>
                           <th className={`${classes.headerCell} ${classes.rightAlign}`}>편집 / 삭제</th>
                       </tr>
                   </thead>
                   <tbody>
                       {workplaceInfo.map((info, index) => (
                           <tr key={index} className={classes.bodyRow}>
                               <td className={classes.cell}>{info.name}</td>
                               <td className={classes.cell}>{info.serialNumber}</td>
                               <td className={classes.cell}>{info.phoneNumber}</td>
                               <td className={`${classes.cell} ${classes.centerAlign}`}>{info.count}</td>
                               <td className={`${classes.cell} ${classes.rightAlign}`}>
                                   <button className={classes.editButton}>편집</button>
                                   <button className={classes.deleteButton}>삭제</button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>

               <div className={classes.addButtonContainer}>
                   <button className={classes.addButton}>
                       <div className={classes.iconContainer}>
                           <svg 
                               className={classes.icon}
                               fill="none" 
                               stroke="currentColor" 
                               viewBox="0 0 24 24"
                           >
                               <path 
                                   strokeLinecap="round" 
                                   strokeLinejoin="round" 
                                   strokeWidth="2" 
                                   d="M19 14l-7 7m0 0l-7-7m7 7V3"
                               />
                           </svg>
                       </div>
                       <span className={classes.addButtonText}>사업장 추가 및 등록</span>
                   </button>
               </div>
           </div>
       </div>
   );
}