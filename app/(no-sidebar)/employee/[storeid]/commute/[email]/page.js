'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { nextClient } from '@/lib/nextClient';

export default function AttendancePage() {
    const [loading, setLoading] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);


    const params = useParams();
    const storeId = params.storeid; 
    const email = params.email;

    useEffect(() => {
        // 브라우저가 geolocation을 지원하지 않는 경우 체크
        const checkIsDesktop = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            // alert(navigator.userAgent.toLowerCase())
            return userAgent.includes('windows');
            
        };
        setIsDesktop(checkIsDesktop());
    
        // 브라우저가 geolocation을 지원하지 않는 경우 체크
        if (!('geolocation' in navigator)) {
            setLocationPermission(false);
            return;
        }
        function isIphoneSafari() {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            alert(userAgent)
            return /Safari/i.test(userAgent) && /Mobile/i.test(userAgent);
        }
    
        // 즉시 위치 권한 요청
        navigator.geolocation.getCurrentPosition(
            () => {
                if(isIphoneSafari()) {  // 함수 호출 시 괄호 () 추가
                    setLocationPermission(true);
                }
                else{
                    // 권한 허용 후 permissions API로 상태 관리
                    if ('permissions' in navigator) {
                        navigator.permissions.query({ name: 'geolocation' })
                            .then((result) => {
                                setLocationPermission(result.state === 'granted');
                                
                                result.addEventListener('change', () => {
                                    setLocationPermission(result.state === 'granted');
                                });
                            })
                            .catch(() => {
                                setLocationPermission(true); // Permissions API가 없을 경우 기본 허용
                            });
                    } else {
                        setLocationPermission(true); // Permissions API 미지원
                    }
                }
            },
            (error) => {
                setLocationPermission(false);
                if (error.code === 1) { // PERMISSION_DENIED
                    alert('위치 정보 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
                }
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);
    
    const getCurrentLocation = async () => {
        const getPosition = async (options) => {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation is not supported by your browser'));
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }),
                    reject,
                    options
                );
            });
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        let lastError;
        
        for (let retryCount = 0; retryCount < 10; retryCount++) {
            try {
                if (retryCount > 0) {
                    console.log(`위치 정보 재시도 중... ${retryCount + 1}/10`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const position = await getPosition(options);
                
                // 정확도가 100m 이상이면 재시도
                if (position.accuracy > 100 && retryCount < 9) {
                    console.log(`낮은 정확도 (${position.accuracy}m), 재시도 중...`);
                    lastError = new Error('낮은 정확도');
                    continue;
                }
                alert(`Latitude: ${position.lat}\nLongitude: ${position.lng}\nAccuracy: ${position.accuracy}`);
                console.log(`위치 정확도: ${position.accuracy}m`);
                return position;

            } catch (error) {
                lastError = error;
                
                if (error.code === 1) { // 권한 거부
                    throw new Error('위치 정보 접근이 거부되었습니다');
                }
                
                if (retryCount < 9) {
                    console.log(`위치 정보 획득 실패: ${error.message}`);
                    if (error.code === 3) { // 타임아웃
                        options.timeout += 2000; // 타임아웃 시간 증가
                    }
                    continue;
                }
            }
        }

        throw new Error(`10번의 시도 후 위치 정보 획득 실패: ${lastError.message}`);
    };

    const handleSubmit = async (e, type) => {
        e.preventDefault()
 
        try {
            setLoading(true)
            
            const location = await getCurrentLocation()

            const   latitude= location.lat;
            const longitude= location.lng;
            const endpoint = (type === 'go') ? 'go-to-work' : 'leave-work'

            const serverResponse = await nextClient.post('/attendance/employee/commute', {
                latitude,
                longitude,
                endpoint,
                storeId,
                email
            });

            alert(serverResponse.data.message);
            
        } catch (error) {
            console.error('오류:', error);
            if (error.message.includes('위치 정보 접근이 거부되었습니다')) {
                alert('위치 정보 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해주세요.');
            } else {
                alert('정확한 위치 정보를 가져오는데 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 mt-2">
            <form className="space-y-6 mb-6" onSubmit={(e) => e.preventDefault()}>
                <div className={`bg-yellow-100 border-l-4 ${locationPermission ? 'border-green-500' : 'border-yellow-500'} p-4 mb-6 rounded-r-lg`}>
                    <div className="flex items-center">
                        <svg className={`w-6 h-6 ${locationPermission ? 'text-green-500' : 'text-yellow-500'} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {locationPermission ? (
                                // 체크 아이콘
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            ) : (
                                // 경고 아이콘
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                        </svg>
                        <span className={`font-bold ${locationPermission && !isDesktop ? 'text-green-700' : 'text-yellow-700'}`}>
                            {locationPermission 
                                ? isDesktop 
                                    ? '휴대폰으로 접속해주세요!' 
                                    : '위치 권한이 허용되었습니다'
                                : '반드시 휴대폰을 이용하고 위치 권한을 허용해주세요!'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4">
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'go')}
                    disabled={loading || !locationPermission || isDesktop}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600"
                >
                    {loading ? 'Processing...' : '출근하기'}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'leave')}
                    disabled={loading || !locationPermission || isDesktop}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 hover:bg-red-600"
                >
                    {loading ? 'Processing...' : '퇴근하기'}
                </button>
                </div>
            </form>
            <a 
                href="https://www.wooribank.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block mt-8 hover:transform hover:scale-105 transition-transform duration-200"
            >
                <div className="relative bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm overflow-hidden">
                    <div className="animate-pulse absolute inset-0 bg-green-100 opacity-30"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-10 h-10 text-green-500 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-green-700 text-lg">우리 은행 계좌를 사용하면 많은 혜택이 있습니다! →</span>
                        </div>
                        <svg className="w-6 h-6 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-green-200 animate-shimmer"></div>
                </div>
            </a>
        </div>
    )
}