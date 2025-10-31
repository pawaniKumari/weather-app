import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import mainIcon from "../src/assets/sun.png";

const cityList = [
  { CityCode: "1248991", CityName: "Colombo" },
  { CityCode: "1850147", CityName: "Tokyo" },
  { CityCode: "2644210", CityName: "Liverpool" },
  { CityCode: "2988507", CityName: "Paris" },
  { CityCode: "2147714", CityName: "Sydney" },
  { CityCode: "4930956", CityName: "Boston" },
  { CityCode: "1796236", CityName: "Shanghai" },
  { CityCode: "3143244", CityName: "Oslo" },
];

export default function Navbar() {
  const [city, setCity] = useState("");
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // Filter cities by input
  const filteredCities = city
    ? cityList.filter((c) =>
        c.CityName.toLowerCase().includes(city.toLowerCase())
      )
    : [];

  // Add handler for Enter key
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && filteredCities.length > 0) {
      setCity(filteredCities[0].CityName);
      navigate(`/city/${filteredCities[0].CityName}`);
    }
  };

  const handleCitySelect = (cityName) => {
    setCity(cityName);
    navigate(`/city/${cityName}`);
  };

  return (
    <>
      <div className="text-center pt-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center gap-3">
          <img
            src={mainIcon}
            alt="Weather"
            className="w-12 h-12 object-contain"
          />
          <span>Weather App</span>
        </h1>
        <div className="flex justify-center gap-3">
          <div className="relative w-60">
            <input
              type="text"
              placeholder="Enter a city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="px-4 py-2 rounded-lg outline-none w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600"
            />
            {city && filteredCities.length > 0 && (
              <ul className="absolute left-0 right-0 bg-gray-900 border border-gray-700 rounded-lg mt-1 z-10 text-left max-h-40 overflow-y-auto">
                {filteredCities.map((c) => (
                  <li
                    key={c.CityCode}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onMouseDown={() => handleCitySelect(c.CityName)}
                  >
                    {c.CityName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {isAuthenticated ? (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
}
