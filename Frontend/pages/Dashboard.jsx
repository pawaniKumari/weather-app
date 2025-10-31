import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CityCard from "../components/CityCard";
import { formatTime, getRandomColor } from "../components/Helper";
import weatherBg from "../src/assets/background.jpeg";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const API_PORT = import.meta.env.VITE_API_PORT || 5000;

  useEffect(() => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return;

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const cityListResponse = await axios.get(
          `http://localhost:${API_PORT}/api/weather/cities`
        );
        const cityList = cityListResponse.data;

        const weatherDataPromises = cityList.map((city) =>
          axios.get(`http://localhost:${API_PORT}/api/weather/${city.CityCode}`)
        );

        const weatherDataResponses = await Promise.all(weatherDataPromises);

        const combinedData = weatherDataResponses.map((weatherRes, index) => {
          const cityInfo = cityList[index];
          const weatherInfo = weatherRes.data;
          return {
            name: weatherInfo.name,
            country: cityInfo.Country,
            temp: weatherInfo.temperature,
            desc: weatherInfo.description,
            pressure: weatherInfo.pressure,
            humidity: weatherInfo.humidity,
            min: Math.round(weatherInfo.temperature) - 5,
            max: Math.round(weatherInfo.temperature) + 5,
            color: getRandomColor(), // Assign random color
            visibility: `${(weatherInfo.visibility / 1000).toFixed(1)}km`,
            wind: `${weatherInfo.wind.speed}m/s ${weatherInfo.wind.deg}°`,
            sunrise: formatTime(weatherInfo.sunrise, weatherInfo.timezone),
            sunset: formatTime(weatherInfo.sunset, weatherInfo.timezone),
            timezone: weatherInfo.timezone,
          };
        });
        setCities(combinedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch weather data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [isAuthenticated]);

  //Render check AFTER all hooks
  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to access the weather data.</p>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${weatherBg})` }}
    >
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        {loading && <p className="text-center">Loading cities...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((c, i) => (
              <CityCard key={i} data={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
