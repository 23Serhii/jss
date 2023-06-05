import chalk from "chalk";

export function firstTask() {
  function colorizeText(text, color) {
    return chalk[color](text);
  }

  const userInput = process.argv[2];
  const color = process.argv[3];
  const a = colorizeText(userInput, color);
  return console.log(a);
}
