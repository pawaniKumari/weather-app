import { useNavigate } from "react-router-dom";
import {
  Wind,
} from "lucide-react";
import { getWeatherIcon } from "../components/Helper";

export default function CityCard({ data }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/city/${data.name}`);
  };

  // Get the current date/time in the city's timezone
  const now = new Date();
  const cityTime = new Date(now.getTime() + data.timezone * 1000);
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


  return (
    <div
      className={`relative rounded-2xl shadow-xl overflow-hidden ${data.color} text-white ring-1 ring-white/10 transition transform hover:scale-105 cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="pointer-events-none absolute inset-0">
      
        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-white/0 to-black/30" />
       
        <span className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <span className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-black/20 blur-3xl" />
      </div>

      <div className="relative p-6">
        
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">
              {data.name} {data.country}
            </h2>
            <p className="text-sm text-white/80 mt-1">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-bold">{data.temp}°C</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-end">
          <div className="flex items-center gap-3">
            {getWeatherIcon(data.desc)}
            <p className="text-lg opacity-90">{data.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-base text-white/90">
              Temp Max:{data.max}°C
            </p>
            <p className="text-base text-white/90">
              Temp Min:{data.min}°C
            </p>
          </div>
        </div>
      </div>

      <div className="relative bg-black/80 backdrop-blur-sm p-5 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <p>Pressure: {data.pressure}hPa</p>
            <p>Humidity: {data.humidity}%</p>
            <p>Visibility: {data.visibility}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Wind className="w-6 h-6 text-white" />
            <p>{data.wind}</p>
          </div>
          <div>
            <p>Sunrise: {data.sunrise}</p>
            <p>Sunset: {data.sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
