// Ключи — языки из ALLOWED_LANGS
export const WEATHER_LABELS = {
  ru: {
    title: "Погода в городе",
    temperature: "Температура",
    feelsLike: "ощущается как",
    wind: "Ветер",
    windUnit: "м/с",
    humidity: "Влажность",
    clouds: "Облачность",
    // Откуда дует ветер: С, СВ, В, ...
    compass: ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"],
  },
  en: {
    title: "Weather in",
    temperature: "Temperature",
    feelsLike: "feels like",
    wind: "Wind",
    windUnit: "m/s",
    humidity: "Humidity",
    clouds: "Cloudiness",
    compass: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
  },
};
