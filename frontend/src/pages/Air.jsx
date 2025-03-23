// MAIN CODE WITHOUT MAP

import { useState } from "react";
import axios from "axios";

export default function Air() {
  const [airQuality, setAirQuality] = useState(null);
  const [locationData, setLocationData] = useState({ name: "", lat: null, lon: null });
  const [manualLocation, setManualLocation] = useState({ lat: "", lon: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState(null);

  const fetchAirQuality = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Air Quality Data
      const response = await axios.post("http://localhost:5000/detect-air", { lat, lon });

      if (response.data?.list?.length > 0) {
        setAirQuality({
          aqi: response.data.list[0].main.aqi,
          components: response.data.list[0].components,
        });
      } else {
        throw new Error("Invalid API response format");
      }

      // Fetch Location Name
      fetchLocationName(lat, lon);
      setLocationData({ lat, lon });
    } catch (err) {
      console.error("Error fetching air quality:", err);
      setError("Failed to fetch air quality data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const apiKey = "9d025fae68ebd1148416d3a448e23a42"; // Replace with your OpenWeather API Key
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
      );

      if (response.data.length > 0) {
        setLocationData((prev) => ({
          ...prev,
          name: `${response.data[0].name}, ${response.data[0].country}`,
        }));
      } else {
        setLocationData((prev) => ({ ...prev, name: "Unknown Location" }));
      }
    } catch (err) {
      console.error("Error fetching location name:", err);
      setLocationData((prev) => ({ ...prev, name: "Unknown Location" }));
    }
  };

  const getAQIDescription = (aqi) => {
    switch (aqi) {
      case 1: return { level: "Good", color: "text-green-400", description: "Air quality is satisfactory." };
      case 2: return { level: "Fair", color: "text-yellow-400", description: "Air quality is acceptable." };
      case 3: return { level: "Moderate", color: "text-orange-400", description: "Might cause discomfort for sensitive individuals." };
      case 4: return { level: "Poor", color: "text-red-400", description: "Health effects for sensitive groups." };
      case 5: return { level: "Very Poor", color: "text-purple-400", description: "Serious health risks. Avoid outdoor activities." };
      default: return { level: "Unknown", color: "text-gray-400", description: "Data unavailable." };
    }
  };

  const handleUseCurrentLocation = () => {
    setMethod("auto");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchAirQuality(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location access denied. Please enter manually.");
        setMethod(null);
      }
    );
  };

  const handleManualSearch = () => {
    if (!manualLocation.lat || !manualLocation.lon) {
      setError("Please enter valid latitude and longitude.");
      return;
    }
    fetchAirQuality(parseFloat(manualLocation.lat), parseFloat(manualLocation.lon));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center py-16">
      <h1 className="text-4xl font-bold text-green-400">Air Pollution Detector</h1>
      <p className="text-gray-300 mt-3">Real-time Air Quality Information</p>

      {!method ? (
        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleUseCurrentLocation}
            className="bg-blue-500 px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            🌍 Use Current Location
          </button>
          <button
            onClick={() => setMethod("manual")}
            className="bg-gray-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            🏙️ Enter Location Manually
          </button>
        </div>
      ) : (
        <>
          {error && <p className="text-red-400 mt-3">{error}</p>}
          {locationData.name && (
            <p className="mt-2 text-lg font-semibold text-blue-400">
              📍 {locationData.name} <br />
              🌎 Coordinates: {locationData.lat}, {locationData.lon}
            </p>
          )}
          {loading && !error && <p className="mt-3 text-gray-400">Loading air quality data...</p>}

          {airQuality && (
            <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg w-96 text-center">
              <h2 className={`text-2xl font-semibold ${getAQIDescription(airQuality.aqi).color}`}>
                Air Quality: {getAQIDescription(airQuality.aqi).level}
              </h2>
              <p className="mt-2 text-gray-300">{getAQIDescription(airQuality.aqi).description}</p>
              <p className="mt-4 text-lg font-semibold">AQI: {airQuality.aqi}</p>

              <div className="mt-4 text-gray-300">
                <p>CO: {airQuality.components.co || "N/A"} μg/m³</p>
                <p>NO₂: {airQuality.components.no2 || "N/A"} μg/m³</p>
                <p>O₃: {airQuality.components.o3 || "N/A"} μg/m³</p>
                <p>SO₂: {airQuality.components.so2 || "N/A"} μg/m³</p>
                <p>PM2.5: {airQuality.components.pm2_5 || "N/A"} μg/m³</p>
                <p>PM10: {airQuality.components.pm10 || "N/A"} μg/m³</p>
              </div>
            </div>
          )}

          {method === "manual" && (
            <div className="mt-8 p-4 bg-gray-900 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-lg font-semibold text-gray-200">Check Air Quality for Another Location</h2>
              <input
                type="text"
                placeholder="Enter Latitude"
                value={manualLocation.lat}
                onChange={(e) => setManualLocation({ ...manualLocation, lat: e.target.value })}
                className="mt-2 p-2 rounded bg-gray-700 text-white w-full"
              />
              <input
                type="text"
                placeholder="Enter Longitude"
                value={manualLocation.lon}
                onChange={(e) => setManualLocation({ ...manualLocation, lon: e.target.value })}
                className="mt-2 p-2 rounded bg-gray-700 text-white w-full"
              />
              <button
                onClick={handleManualSearch}
                className="mt-4 bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
              >
                Check Air Quality
              </button>
              
            </div>
            
          )}
        </>
      )}
    </div>
  );
}
