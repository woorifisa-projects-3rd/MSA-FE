export const getGeocode = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      } else {
        throw new Error("해당 주소에 대응되는 위도, 경도 결과를 찾지 못함");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };