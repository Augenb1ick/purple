import chalk from "chalk";
import dedent from "dedent";

import { ALLOWED_LANGS, DEFAULT_LANG } from "../constants/dictionary.js";
import {
  WEATHER_ICONS,
  NIGHT_CLEAR_ICON,
  DEFAULT_ICON,
} from "../constants/icons.js";
import { WEATHER_ART, ART_BY_ICON_CODE, ART_WIDTH } from "../constants/art.js";
import { WEATHER_LABELS } from "../constants/translations.js";
import {
  drawBar,
  drawBox,
  padEndVisible,
  getVisibleWidth,
} from "../helpers/terminal.js";

// Верхняя граница диапазона температуры → цвет
const TEMPERATURE_COLORS = [
  [-15, "#7986cb"],
  [-5, "#42a5f5"],
  [5, "#4dd0e1"],
  [15, "#81c784"],
  [25, "#ffd54f"],
  [Infinity, "#ff7043"],
];

// Ветер дует ОТКУДА (С, СВ, ...), стрелка показывает КУДА
const WIND_ARROWS = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];

export const printError = (message) => {
  console.error(`${chalk.bgRed(" ERROR ")} ${message}`);
};

export const printSuccess = (message) => {
  console.log(`${chalk.bgGreen(" SUCCESS ")} ${message}`);
};

export const printHelp = () => {
  console.log(
    dedent`
    ${chalk.bgCyan(" HELP ")}
    Без параметров — вывод погоды
    -c [город] — сохранение города
       несколько городов — через запятую и в кавычках: -c "Москва,Казань"
    -t [токен] — сохранение токена
    -l [язык] — сохранение языка [${ALLOWED_LANGS.join("|")}]
    -h — вывод помощи`,
  );
};

// Код иконки OpenWeather: "10d" → "10" (состояние) + "d"/"n" (день/ночь)
const parseIconCode = (iconCode) => ({
  code: iconCode.slice(0, 2),
  isNight: iconCode.endsWith("n"),
});

const getIcon = ({ code, isNight }) =>
  isNight && code === "01"
    ? NIGHT_CLEAR_ICON
    : (WEATHER_ICONS[code] ?? DEFAULT_ICON);

const getArt = ({ code, isNight }) => {
  const key = isNight && code === "01" ? "moon" : ART_BY_ICON_CODE[code];
  const art = WEATHER_ART[key];

  if (!art) {
    return [];
  }
  return art.lines.map((line) => chalk[art.color](line));
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatTemperature = (temp) => {
  const value = Math.round(temp);
  const sign = value > 0 ? "+" : "";
  const [, color] = TEMPERATURE_COLORS.find(([max]) => value <= max);

  return chalk.hex(color).bold(`${sign}${value}°C`);
};

const formatWind = ({ speed, deg }, labels) => {
  const text = `${speed} ${labels.windUnit}`;

  if (deg === undefined) {
    return text;
  }

  const index = Math.round(deg / 45) % 8;
  return `${chalk.cyan(WIND_ARROWS[index])} ${text}, ${labels.compass[index]}`;
};

// Время по местному часовому поясу города (timezone — сдвиг от UTC в секундах)
const formatTime = (unixSeconds, timezone) =>
  new Date((unixSeconds + timezone) * 1000).toISOString().slice(11, 16);

// Таблица «подпись — значение» с выровненной колонкой подписей
const formatRows = (rows) => {
  const labelWidth = Math.max(...rows.map(([label]) => getVisibleWidth(label)));
  return rows.map(
    ([label, value]) => `${chalk.gray(padEndVisible(label, labelWidth))}  ${value}`,
  );
};

// Две колонки: арт слева, данные справа
const joinColumns = (left, right) => {
  const height = Math.max(left.length, right.length);
  return Array.from(
    { length: height },
    (_, i) => `${padEndVisible(left[i] ?? "", ART_WIDTH)}  ${right[i] ?? ""}`,
  );
};

export const formatWeather = (weather, lang = DEFAULT_LANG) => {
  const labels = WEATHER_LABELS[lang] ?? WEATHER_LABELS[DEFAULT_LANG];
  const { main, wind, clouds, sys, timezone } = weather;
  const [condition] = weather.weather;
  const icon = parseIconCode(condition.icon);

  const details = [
    chalk.bold(`${getIcon(icon)} ${capitalize(condition.description)}`),
    ...formatRows([
      [
        labels.temperature,
        `${formatTemperature(main.temp)} ${chalk.gray(`(${labels.feelsLike} ${formatTemperature(main.feels_like)})`)}`,
      ],
      [labels.wind, formatWind(wind, labels)],
      [labels.humidity, `${drawBar(main.humidity, chalk.blueBright)} ${main.humidity}%`],
      [labels.clouds, `${drawBar(clouds.all, chalk.white)} ${clouds.all}%`],
    ]),
    `🌅 ${formatTime(sys.sunrise, timezone)}   🌇 ${formatTime(sys.sunset, timezone)}`,
  ];

  const title = `${labels.title} ${chalk.bold.red(weather.name)}`;
  return drawBox(title, joinColumns(getArt(icon), details));
};

export const printWeather = (weather, lang) => {
  console.log(formatWeather(weather, lang));
};
