import classes from './DefaultTable.module.css';
import TestButton from '../button/TestButton';

// 사용법: 테이블의 이름, 테이블 헤더, 각 테이블의 헤더에 맞는 데이터 리스트
// 만약 각행에 버튼을 넣고 싶다면 헤더에 맞는 데이터 리스트가 없으면 자동으로 버튼 생성
export default function DefaultTable({ tableName, tableHeaders, list }) {
    return (
        <div>
            <h3 className={classes.workplaceTitle}>{tableName}</h3>
            <table className={classes.table}>
                <thead className={classes.tableHeader}>
                    <tr className={classes.headerRow}>
                        {Object.values(tableHeaders).map((label, index) => (
                            <th key={index} className={classes.headerCell}>
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {list.map((data, rowIndex) => (
                        <tr key={rowIndex} className={classes.bodyRow}>
                            {Object.values(tableHeaders).map((label, colIndex) => {
                                const values = Object.values(data);
                                if (colIndex >= values.length) {
                                    return (
                                        <td key={colIndex} className={classes.cell}>
                                            <TestButton text={label} color={"#007BFF"}/>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={colIndex} className={classes.cell}>
                                        {values[colIndex]}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}