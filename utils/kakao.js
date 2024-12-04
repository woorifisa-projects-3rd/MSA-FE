'use client';

import { useEffect, useRef, useState } from "react";
import Script from 'next/script';
import { useRegistration } from "@/contexts/RegistrationContext";
import BaseButton from "@/components/button/base-button";

export const KakaoMap = ({latAndLng}) => {
    const {setFormData} =  useRegistration();
    const mapContainer = useRef(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const {lat,lng}= latAndLng;
    const initializeMap = () => {
        if (!window.kakao?.maps || !mapContainer.current) return;

        const map = new window.kakao.maps.Map(mapContainer.current, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3
        });

        const marker = new window.kakao.maps.Marker({
        });
        marker.setMap(map);

        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
            setCurrentLocation(latlng);
        });
    };

    const handleConfirmLocation = () => {
        if (currentLocation) {

            setFormData(prev => ({
                ...prev,
                latitude: currentLocation.getLat(),
                longitude: currentLocation.getLng()
            }))
        } else {
            alert('위치를 먼저 선택해주세요');
        }
    };

    useEffect(() => {
        window.kakao?.maps?.load(initializeMap);
    }, [lat, lng]);

    return (
        <>
            <Script
                src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
                onLoad={() => window.kakao?.maps?.load(initializeMap)}/>
            <div>
                <div ref={mapContainer} style={{ width: '500px', height: '400px' }} />
                <BaseButton text="위치 확정" onClick={handleConfirmLocation} />
                {/* <button type='button' onClick={handleConfirmLocation} className={styles['zip-code-button']}>위치 확정</button> */}
            </div>
        </>
    );
};