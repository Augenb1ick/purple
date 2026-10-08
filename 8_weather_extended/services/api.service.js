import axios from "axios";

const api = axios.create({
  baseURL: "https://api.openweathermap.org",
  timeout: 5000,
});

export const fetchCoordinates = async (city, token) => {
  const { data } = await api.get("/geo/1.0/direct", {
    params: { q: city, limit: 1, appid: token },
  });

  // Если город не найден, geo-API отвечает 200 с пустым массивом
  if (data.length === 0) {
    throw new Error("Город не найден");
  }

  const { lat, lon } = data[0];
  return { lat, lon };
};

export const fetchWeather = async ({ lat, lon }, token, lang) => {
  const { data } = await api.get("/data/2.5/weather", {
    params: { lat, lon, units: "metric", lang, appid: token },
  });

  return data;
};
