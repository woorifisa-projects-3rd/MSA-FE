'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function AddressSearch() {
    const API_KEY = "AIzaSyD85M6vyeKk6hnsbSRILhMT2Clco7mC9sY"
    const [loading, setLoading] = useState(false)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const email = formData.get('email')

        try {
            setLoading(true)
            
            // GPS로 현재 위치 가져오기
            const location = await getCurrentLocation()
            console.log('Current location:', location)

            const serverResponse = await fetch(`http://localhost:8888/attendance/${storeId}/go-to-work`, {
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
                alert('출근이 성공적으로 기록되었습니다.')
            } else if (statusCode === 202) {
                alert('출근이 성공적으로 되었으나 이전 퇴근을 찍지 않으셨습니다 사장님께 연락해주세요')
            } else if (statusCode === 403){
                alert('위치가 다릅니다')
            }
            else {
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
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    required
                    className="px-3 py-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                >
                    {loading ? 'Processing...' : '출근하기'}
                </button>
            </form>
        </div>
    )
}