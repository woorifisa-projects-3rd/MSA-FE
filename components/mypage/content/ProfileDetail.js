    'use client'
    import classes from './ProfileDetail.module.css';
    import PresidentInfo from './PresidentInfo';

    export default function ProfileDetail() {
dev

        console.log("마이페이지 사업장 리스트",  workplaceInfo)
        console.log("선택한 사업장 정보", selectedWorkplace)

        return (
            <div className={classes.container}>
                <div className={classes.otherComponent}>
                    <PresidentInfo />
                </div>
            </div>
        );
    }
