const {
  ERROR_MESSAGE,
  TIME_RULES,
  NOTIFY_TIMER_MES,
  REMAINING_TIME_MES,
  FINISH_MES,
} = require('./constants')

const input = process.argv.slice(2).join(' ').toLowerCase();

const parseTimeToSeconds = (text) => {
  let totalSeconds = 0;
  for (const { regex, multiplier } of TIME_RULES) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      totalSeconds += parseInt(match[1], 10) * multiplier;
    }
  }

  return totalSeconds;
}

const printMessage = (message) => process.stdout.write(`\r\x1b[K${message}`)

const initTimer = (seconds) => {
  if (seconds <= 0) {
    console.log(ERROR_MESSAGE);
    return;
  }

  console.log(NOTIFY_TIMER_MES(seconds));

  let remaining = seconds;

  const intervalId = setInterval(() => {
    remaining--;

    if (remaining > 0) {
      printMessage(REMAINING_TIME_MES(remaining));
    } else {
      printMessage(FINISH_MES);
      clearInterval(intervalId);
    }
  }, 1000);
}

const totalSeconds = parseTimeToSeconds(input);
initTimer(totalSeconds);