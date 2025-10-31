import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
} from "lucide-react";

// Helper to format time from UNIX timestamp considering the city's timezone
export const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

// Helper to get weather icon based on description
export const getWeatherIcon = (description) => {
  const desc = description.toLowerCase();

  if (desc.includes("clear") || desc.includes("sunny")) {
    return <Sun className="w-10 h-10" />;
  } else if (desc.includes("rain")) {
    return <CloudRain className="w-10 h-10" />;
  } else if (desc.includes("drizzle")) {
    return <CloudDrizzle className="w-10 h-10" />;
  } else if (desc.includes("snow")) {
    return <CloudSnow className="w-10 h-10" />;
  } else if (desc.includes("thunder") || desc.includes("storm")) {
    return <CloudLightning className="w-10 h-10" />;
  } else if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze")) {
    return <CloudFog className="w-10 h-10" />;
  } else if (desc.includes("cloud")) {
    return <Cloud className="w-10 h-10" />;
  } else {
    return <Sun className="w-10 h-10" />;
  }
};

// Function to get random Tailwind color
export const getRandomColor = () => {
  const colors = [
      "bg-sky-400",     
      "bg-blue-500",    
      "bg-gray-400",   
      "bg-orange-400",  
      "bg-indigo-500",  
      "bg-purple-600",  
      "bg-teal-400",   
      "bg-pink-400",    
      "bg-cyan-400",    
      "bg-lime-400",    
      "bg-fuchsia-400", 
      "bg-amber-400",   
      "bg-violet-400",  
    ];       
  return colors[Math.floor(Math.random() * colors.length)];
};