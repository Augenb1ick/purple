export const formatWeather = (weather) => {
  return {
    title: `Погода в городе ${weather.name}`,
    description: weather.weather[0].description,
    temp: weather.main.temp,
    tempFeelsLike: weather.main.feels_like,
    humidity: weather.main.humidity,
    windSpeed: weather.speed,
  };
};
