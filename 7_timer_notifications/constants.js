const ERROR_MESSAGE =
  "Укажите корректное время (например: node timer.js 1 час 2 минуты 33 секунды)";
const TIME_RULES = [
  { regex: /(\d+)\s*(h|hour|hours|ч|час|часа|часов)/gi, multiplier: 3600 },
  {
    regex: /(\d+)\s*(m|min|minutes|мин|минута|минуты|минут)/gi,
    multiplier: 60,
  },
  {
    regex: /(\d+)\s*(s|sec|second|seconds|сек|секунда|секунды|секунд)/gi,
    multiplier: 1,
  },
];
const NOTIFY_TIMER_MES = (sec) => `Вы поставили таймер на: ${sec} секунд`;
const REMAINING_TIME_MES = (secLeft) => `Осталось секунд: ${secLeft}`;
const FINISH_MES = "Таймер закончился";

module.exports = {
  ERROR_MESSAGE,
  TIME_RULES,
  NOTIFY_TIMER_MES,
  REMAINING_TIME_MES,
  FINISH_MES,
};
