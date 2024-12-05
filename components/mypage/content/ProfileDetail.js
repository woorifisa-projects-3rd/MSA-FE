    'use client'
    import DefaultTable from '@/components/table/DefaultTable';
    import classes from './ProfileDetail.module.css';
    // import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
    import ModalContainer from '@/components/modal/modal-container';
    import { useState, useEffect, useRef } from 'react';
    import PrimaryButton from '@/components/button/primary-button';
    import DeleteConfirmModal from '@/components/modal/delete-confirm/delete-confirm';
    import PresidentInfo from './PresidentInfo';
    import { bankCodeList } from '@/constants/bankCodeList';
    import { nextClient } from '@/lib/nextClient';
    import FirstStoreRegistration from '@/components/modal/workplace-registration.js/FirstStoreRegistration';
    import AdditionalStoreRegistration from '@/components/modal/workplace-registration.js/AdditionalStoreRegistraion';
    import DeleteModal from '@/components/modal/delete-commute-modal/delete-commute-modal';

    export default function ProfileDetail() {

        return (
            <div className={classes.container}>
                <div className={classes.otherComponent}>
                    <PresidentInfo />
                </div>
            </div>
        );
    }
