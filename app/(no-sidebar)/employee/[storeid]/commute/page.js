'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function AttendancePage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const params = useParams()
    const storeId = params.storeid 

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'))
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault()
        if (!email) {
            alert('이메일을 입력해주세요')
            return
        }

        try {
            setLoading(true)
            
            const location = await getCurrentLocation()
            console.log('Current location:', location)

            const endpoint = type === 'go' ? 'go-to-work' : 'leave-work'
            const serverResponse = await fetch(`http://localhost:8888/attendance/${storeId}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    latitude: location.lat,
                    longitude: location.lng
                })
            })
            
            const statusCode = serverResponse.status;
            if (statusCode === 200) {
                alert(type === 'go' ? '출근이 성공적으로 기록되었습니다.' : '퇴근이 성공적으로 기록되었습니다.')
            } else if (statusCode === 202 && type === 'go') {
                alert('출근이 성공적으로 되었으나 이전 퇴근을 찍지 않으셨습니다 사장님께 연락해주세요')
            } else if (statusCode === 400 && type === 'leave') {
                alert('출근을 찍어주세요')
            } else if (statusCode === 403) {
                alert('위치가 다릅니다')
            } else {
                throw new Error('Failed to send data to server')
            }
        } catch (error) {
            alert('위치 정보를 가져오는데 실패했거나 처리 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    required
                    className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'go')}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600"
                    >
                        {loading ? 'Processing...' : '출근하기'}
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'leave')}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 hover:bg-red-600"
                    >
                        {loading ? 'Processing...' : '퇴근하기'}
                    </button>
                </div>
            </form>
        </div>
    )
}