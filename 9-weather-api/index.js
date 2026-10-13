import express from "express";
import { getWeather } from "./services/weather.service.js";
import { formatWeather } from "./services/format.service.js";

const port = process.env.APP_PORT || 8000;
const apiToken = process.env.API_TOKEN;

const app = express();

app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    res.status(400).json({ error: "Город не указан" });
  } else {
    const weatherData = await getWeather(city, apiToken, "ru");
    const formattedWeatherData = formatWeather(weatherData, "ru");

    res.send(formattedWeatherData);
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
