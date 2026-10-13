import { fetchCoordinates, fetchWeather } from "./api.service.js";
import { getKeyValue, updateKeyValue } from "./storage.service.js";
import { STORAGE_KEYS } from "../constants/dictionary.js";

// " Нижний  Новгород" и "нижний новгород" — один и тот же город в кэше
const toCacheKey = (city) => city.trim().replace(/\s+/g, " ").toLowerCase();

// Координаты города не меняются, поэтому кэшируем их навсегда
const getCoordinates = async (city, token) => {
  const key = toCacheKey(city);
  const cache = (await getKeyValue(STORAGE_KEYS.coordinates)) ?? {};

  if (cache[key]) {
    return cache[key];
  }

  const coordinates = await fetchCoordinates(city, token);
  await updateKeyValue(STORAGE_KEYS.coordinates, (current = {}) => ({
    ...current,
    [key]: coordinates,
  }));

  return coordinates;
};

export const getWeather = async (city, token, lang) => {
  const coordinates = await getCoordinates(city, token);
  return fetchWeather(coordinates, token, lang);
};
