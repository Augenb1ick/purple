export const formatError = (error) => {
  switch (error.response?.status) {
    case 401:
      return "Неверно указан токен";
    case 404:
      return "Не найдено";
    case 429:
      return "Превышен лимит запросов, попробуйте позже";
  }

  if (error.isAxiosError && !error.response) {
    return "Сервис погоды недоступен, проверьте подключение";
  }

  return error.message;
};
