import express from "express";
import axios from "axios";
import NodeCache from "node-cache";
import dotenv from "dotenv";

dotenv.config();

export default function (cities) {
  const router = express.Router();
  const cache = new NodeCache({ stdTTL: 300 });

  router.get("/cities", (req, res) => {
    res.json(cities);
  });

  router.get("/:cityId", async (req, res) => {
    const { cityId } = req.params;

    const cachedData = cache.get(cityId);
    if (cachedData) return res.json(cachedData);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
      );

      const data = {
        name: response.data.name,
        description: response.data.weather[0].description,
        temperature: response.data.main.temp,
        temp_min: response.data.main.temp_min,
        temp_max: response.data.main.temp_max,
        pressure: response.data.main.pressure,
        humidity: response.data.main.humidity,
        visibility: response.data.visibility,
        wind: response.data.wind,
        sunrise: response.data.sys.sunrise,
        sunset: response.data.sys.sunset,
        timezone: response.data.timezone,
      };

      cache.set(cityId, data);
      res.json(data);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  return router;
}
