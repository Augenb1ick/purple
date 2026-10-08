// ASCII-арт состояний погоды. color — название цвета chalk.
// Первая и последняя строки шаблона — служебные переносы, они отбрасываются
const toLines = (art) => art.split("\n").slice(1, -1);

export const WEATHER_ART = {
  clear: {
    color: "yellowBright",
    lines: toLines(String.raw`
   \  |  /
    .---.
-- (     ) --
    '---'
   /  |  \
`),
  },
  moon: {
    color: "whiteBright",
    lines: toLines(String.raw`
     .--.    *
    (  (
   (   (   *
    (  (
     '--'  *
`),
  },
  partlyCloudy: {
    color: "yellow",
    lines: toLines(String.raw`
  \  |  /
 -- .-.--.
   (      ).
  (___.__)__)

`),
  },
  cloudy: {
    color: "gray",
    lines: toLines(String.raw`

     .--.
  .-(    ).
 (___.__)__)

`),
  },
  rain: {
    color: "blueBright",
    lines: toLines(String.raw`
     .--.
  .-(    ).
 (___.__)__)
   ' ' ' '
  ' ' ' '
`),
  },
  thunder: {
    color: "yellow",
    lines: toLines(String.raw`
     .--.
  .-(    ).
 (___.__)__)
    /_  /_
     /   /
`),
  },
  snow: {
    color: "whiteBright",
    lines: toLines(String.raw`
     .--.
  .-(    ).
 (___.__)__)
   *  *  *
    *  *  *
`),
  },
  fog: {
    color: "gray",
    lines: toLines(String.raw`

 _ - _ - _ -
  _ - _ - _
 _ - _ - _ -

`),
  },
};

// Ключ — первые две цифры кода иконки OpenWeather
export const ART_BY_ICON_CODE = {
  "01": "clear",
  "02": "partlyCloudy",
  "03": "cloudy",
  "04": "cloudy",
  "09": "rain",
  "10": "rain",
  "11": "thunder",
  "13": "snow",
  "50": "fog",
};

// Ширина колонки с артом одинакова для всех карточек
export const ART_WIDTH = Math.max(
  ...Object.values(WEATHER_ART).flatMap(({ lines }) =>
    lines.map((line) => line.length),
  ),
);
