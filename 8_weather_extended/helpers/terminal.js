import chalk from "chalk";
import { stripVTControlCharacters } from "node:util";

const segmenter = new Intl.Segmenter();

// Эмодзи занимают в терминале две клетки
const isWide = (grapheme) => /\p{Emoji_Presentation}|️/u.test(grapheme);

// Ширина строки в терминале: без ANSI-цветов и с учётом эмодзи
export const getVisibleWidth = (str) => {
  let width = 0;
  for (const { segment } of segmenter.segment(stripVTControlCharacters(str))) {
    width += isWide(segment) ? 2 : 1;
  }
  return width;
};

export const padEndVisible = (str, width) =>
  str + " ".repeat(Math.max(0, width - getVisibleWidth(str)));

export const drawBar = (percent, color, width = 10) => {
  const filled = Math.round((percent / 100) * width);
  return color("█".repeat(filled)) + chalk.gray("░".repeat(width - filled));
};

export const drawBox = (title, lines) => {
  const border = chalk.gray;
  const titleWidth = getVisibleWidth(title);
  const contentWidth = Math.max(titleWidth + 1, ...lines.map(getVisibleWidth));

  const top =
    border("╭─ ") +
    title +
    border(` ${"─".repeat(contentWidth - titleWidth - 1)}╮`);
  const body = lines.map(
    (line) => border("│ ") + padEndVisible(line, contentWidth) + border(" │"),
  );
  const bottom = border(`╰${"─".repeat(contentWidth + 2)}╯`);

  return [top, ...body, bottom].join("\n");
};
