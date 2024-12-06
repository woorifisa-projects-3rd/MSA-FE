    'use client'
    import classes from './ProfileDetail.module.css';
    import PresidentInfo from './PresidentInfo';

    export default function ProfileDetail() {

        return (
            <div className={classes.container}>
                <div className={classes.otherComponent}>
                    <PresidentInfo />
                </div>
            </div>
        );
    }
