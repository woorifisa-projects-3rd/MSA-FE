'use client';

import { useEffect, useRef, useState } from "react";
import Script from 'next/script';
import { useRegistration } from "@/contexts/RegistrationContext";
import { NextResponse } from "next/server";
import BaseButton from "@/components/button/base-button";

export const KakaoMap = ({latAndLng,isChange = false }) => {
    const {setFormData} =  useRegistration();
    const mapContainer = useRef(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const {lat,lng}= latAndLng;

    const handleKakaoMapRequest = (request) => {
        if (request.url.includes('dapi.kakao.com')) {
            const response = NextResponse.next();
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
            return response;
        }
        return NextResponse.next();
    };


    const initializeMap = () => {
        // 초기 상태 체크 및 로깅
        console.log('InitializeMap called:', {
            kakaoMaps: !!window.kakao?.maps,
            container: !!mapContainer.current,
            coordinates: { lat, lng }
        });
    
        try {
            // 필수 조건 검사
            if (!window.kakao?.maps) {
                throw new Error('Kakao maps not loaded');
            }
            if (!mapContainer.current) {
                throw new Error('Map container not found');
            }
            if (!lat || !lng) {
                throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
            }
    
            // 맵 생성
            const mapOptions = {
                center: new window.kakao.maps.LatLng(lat, lng),
                level: 3
            };
            
            console.log('Creating map with options:', mapOptions);
            const map = new window.kakao.maps.Map(mapContainer.current, mapOptions);
    
            // 마커 생성
            const markerPosition = map.getCenter();

            const markerOptions = isChange
                                ? { position: markerPosition }
                                : {};
                                
            const marker = new window.kakao.maps.Marker(markerOptions);
            marker.setMap(map);
            
            console.log('Map and marker created successfully');
    
            // 클릭 이벤트 리스너
            window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
                try {
                    const latlng = mouseEvent.latLng;
                    marker.setPosition(latlng);
                    setCurrentLocation(latlng);
                    console.log('New location set:', {
                        lat: latlng.getLat(),
                        lng: latlng.getLng()
                    });
                } catch (error) {
                    console.error('Click event handler error:', error);
                }
            });
    
        } catch (error) {
            console.error('Map initialization failed:', error);
            // 오류 상태를 사용자에게 표시하는 로직 추가 가능
            alert(`지도 초기화 중 오류가 발생했습니다: ${error.message}`);
        }
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
        // 미들웨어 설정
        if (typeof window !== 'undefined') {
            window.addEventListener('fetch', (event) => {
                if (event.request.url.includes('dapi.kakao.com')) {
                    event.respondWith(handleKakaoMapRequest(event.request));
                }
            });
        }
        
        window.kakao?.maps?.load(initializeMap);
        
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('fetch', handleKakaoMapRequest);
            }
        };
    }, [lat, lng]);

    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
                onLoad={() => {
                    window.kakao?.maps?.load(() => {
                        initializeMap();
                    });
                }}
           />
            <div>
                <div ref={mapContainer} style={{ width: '500px', height: '400px' }} />
                <BaseButton text="위치 확정" onClick={handleConfirmLocation} />
            </div>
        </>
    );
};