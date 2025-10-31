import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: 300 });

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

//allow only your frontend origin
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  })
);

// Load cities.json
const citiesData = JSON.parse(fs.readFileSync("./cities.json", "utf-8"));
const cities = citiesData.List;
const cityCodes = cities.map((city) => city.CityCode);
console.log("Loaded city codes:", cityCodes.length);

app.use("/api/weather", weatherRoutes(cities));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
