#!/usr/bin/env node
import { getArgs } from "./helpers/args.js";
import { formatError } from "./helpers/errors.js";
import { saveKeyValue, getKeyValue } from "./services/storage.service.js";
import {
  printHelp,
  printError,
  printWeather,
  printSuccess,
} from "./services/log.service.js";
import { getWeather } from "./services/weather.service.js";
import {
  STORAGE_KEYS,
  ALLOWED_LANGS,
  DEFAULT_LANG,
} from "./constants/dictionary.js";

// Флаг командной строки → что и как сохранять
const SETTINGS = {
  c: { key: STORAGE_KEYS.city, message: "Город сохранён" },
  t: { key: STORAGE_KEYS.token, message: "Токен сохранён" },
  l: { key: STORAGE_KEYS.lang, message: "Язык сохранён", allowed: ALLOWED_LANGS },
};

const parseCities = (str) =>
  str
    .split(",")
    .map((city) => city.trim())
    .filter(Boolean);

const getConfig = async () => {
  const lang = await getKeyValue(STORAGE_KEYS.lang);

  return {
    token: process.env.WEATHER_TOKEN ?? (await getKeyValue(STORAGE_KEYS.token)),
    city: process.env.WEATHER_CITY ?? (await getKeyValue(STORAGE_KEYS.city)),
    lang: ALLOWED_LANGS.includes(lang) ? lang : DEFAULT_LANG,
  };
};

const getForecast = async () => {
  const { token, city, lang } = await getConfig();

  if (!token) {
    throw new Error("Не задан токен, установите: weather -t [API_KEY]");
  }
  if (!city) {
    throw new Error("Не задан город, установите: weather -c [город]");
  }

  const cities = parseCities(city);
  const results = await Promise.allSettled(
    cities.map((name) => getWeather(name, token, lang)),
  );

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      printWeather(result.value, lang);
    } else {
      printError(`${cities[index]}: ${formatError(result.reason)}`);
      process.exitCode = 1;
    }
  });
};

const validateSettings = (args) => {
  for (const [flag, { allowed }] of Object.entries(SETTINGS)) {
    const value = args[flag];

    if (value === undefined) {
      continue;
    }
    if (typeof value !== "string") {
      throw new Error(`Не указано значение для -${flag}`);
    }
    if (allowed && !allowed.includes(value)) {
      throw new Error(`Неверное значение -${flag}, доступные: ${allowed.join(", ")}`);
    }
  }
};

const saveSettings = async (args) => {
  // Сначала проверяем всё, чтобы не сохранить настройки частично
  validateSettings(args);

  // Сохраняем последовательно: параллельная запись в один файл теряет данные
  for (const [flag, { key, message }] of Object.entries(SETTINGS)) {
    if (args[flag] !== undefined) {
      await saveKeyValue(key, args[flag]);
      printSuccess(message);
    }
  }
};

const initCli = async () => {
  const args = getArgs(process.argv);
  const flags = Object.keys(args);

  const unknownFlags = flags.filter((flag) => flag !== "h" && !(flag in SETTINGS));
  if (unknownFlags.length > 0) {
    throw new Error(
      `Неизвестный параметр: ${unknownFlags.map((f) => `-${f}`).join(", ")}. Справка: weather -h`,
    );
  }

  if (args.h) {
    return printHelp();
  }
  if (flags.length > 0) {
    return saveSettings(args);
  }
  return getForecast();
};

initCli().catch((error) => {
  printError(formatError(error));
  process.exitCode = 1;
});
