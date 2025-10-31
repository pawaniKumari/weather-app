import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  formatTime,
  getWeatherIcon,
  getRandomColor,
} from "../components/Helper";
import weatherBg from "../src/assets/background.jpeg";
import mainIcon from "../src/assets/sun.png";
import { Wind, ArrowBigLeft } from "lucide-react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const API_PORT = import.meta.env.VITE_API_PORT || 5000;

export default function CityView() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCityData = async () => {
      try {
        setLoading(true);
        // First, get the list of all cities to find the city code
        const cityListResponse = await axios.get(
          `http://localhost:${API_PORT}/api/weather/cities`
        );
        const cityInfo = cityListResponse.data.find(
          (c) => c.CityName.toLowerCase() === cityName.toLowerCase()
        );

        if (!cityInfo) {
          setError("City not found.");
          setLoading(false);
          return;
        }

        // Then, fetch the weather for that city using its code
        const weatherResponse = await axios.get(
          `http://localhost:${API_PORT}/api/weather/${cityInfo.CityCode}`
        );
        const weatherData = weatherResponse.data;

        // Get the current date/time in the city's timezone
        const now = new Date();
        const cityTime = new Date(now.getTime() + weatherData.timezone * 1000);
        const formattedDate = `${cityTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}, ${cityTime.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })}`;

        setCity({
          name: weatherData.name,
          country: cityInfo.Country,
          temp: Math.round(weatherData.temperature),
          desc: weatherData.description,
          date: formattedDate,
          min: Math.round(weatherData.temp_min),
          max: Math.round(weatherData.temp_max),
          color: getRandomColor(),
          pressure: `${weatherData.pressure}hPa`,
          humidity: `${weatherData.humidity}%`,
          visibility: `${(weatherData.visibility / 1000).toFixed(1)}km`,
          wind: `${weatherData.wind.speed}m/s ${weatherData.wind.deg}°`,
          sunrise: formatTime(weatherData.sunrise, weatherData.timezone),
          sunset: formatTime(weatherData.sunset, weatherData.timezone),
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch city data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [isAuthenticated, cityName]);

  if (!isAuthenticated) {
    return (
      <div>
        <p>You need to log in to access the weather data.</p>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="h-screen overflow-hidden text-white flex flex-col items-center justify-between bg-cover bg-center"
        style={{ backgroundImage: `url(${weatherBg})` }}
      >
        <p>Loading city details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen text-white flex flex-col justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${weatherBg})` }}
      >
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!city) {
    return null;
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${weatherBg})` }}
    >
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 mt-10 flex-grow">
        <div className="text-center pt-2 mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
            <img
              src={mainIcon}
              alt="Weather"
              className="w-12 h-12 object-contain"
            />
            <span>Weather App</span>
          </h1>
        </div>

        <div className="rounded-2xl overflow-hidden">
          <div
            className={`p-8 relative rounded-2xl overflow-hidden shadow-xl ${city.color}`}
          >
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 text-white opacity-70 hover:opacity-100"
            >
              <ArrowBigLeft className="w-8 h-8" />
            </button>
            <div className="text-center pt-8">
              <h1 className="text-2xl font-semibold">
                {city.name}, {city.country}
              </h1>
              <p className="text-sm opacity-80">{city.date}</p>
            </div>
            <div className="flex justify-around items-center text-center mt-6">
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-2">{getWeatherIcon(city.desc)}</div>
                <p className="text-lg font-medium">{city.desc}</p>
              </div>
              <div className="flex-1 border-l border-white border-opacity-30">
                <p className="text-5xl font-bold">{city.temp}°C</p>
                <p className="text-sm">Temp Min: {city.min}°C</p>
                <p className="text-sm">Temp Max: {city.max}°C</p>
              </div>
            </div>
          </div>
          <div className="bg-[#2d3748] p-8 grid grid-cols-3 gap-8 text-center">
            <div>
              <p>Pressure: {city.pressure}</p>
              <p>Humidity: {city.humidity}</p>
              <p>Visibility: {city.visibility}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Wind className="w-6 h-6 text-white" />
              <p>{city.wind}</p>
            </div>
            <div>
              <p>Sunrise: {city.sunrise}</p>
              <p>Sunset: {city.sunset}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
