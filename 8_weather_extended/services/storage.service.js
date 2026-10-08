import { homedir } from "node:os";
import { join } from "node:path";
import { readFile, writeFile, rename } from "node:fs/promises";

const FILE_PATH = join(homedir(), "weather-data.json");
const TEMP_FILE_PATH = `${FILE_PATH}.tmp`;

const readData = async () => {
  try {
    return JSON.parse(await readFile(FILE_PATH, "utf-8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
};

// Пишем во временный файл и переименовываем: если процесс упадёт посреди
// записи, старый файл останется целым, а читатели не увидят половину JSON
const writeData = async (data) => {
  await writeFile(TEMP_FILE_PATH, JSON.stringify(data, null, 2));
  await rename(TEMP_FILE_PATH, FILE_PATH);
};

// Очередь записей: каждое изменение файла начинается только после
// предыдущего, поэтому параллельные вызовы не затирают данные друг друга
let writeQueue = Promise.resolve();

const enqueue = (task) => {
  const result = writeQueue.then(task);
  writeQueue = result.catch(() => {});
  return result;
};

export const getKeyValue = async (key) => {
  const data = await readData();
  return data[key];
};

// update получает текущее значение и возвращает новое
export const updateKeyValue = (key, update) =>
  enqueue(async () => {
    const data = await readData();
    data[key] = update(data[key]);
    await writeData(data);
  });

export const saveKeyValue = (key, value) => updateKeyValue(key, () => value);
