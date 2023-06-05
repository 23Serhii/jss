import chalk from "chalk";
import player from "play-sound";

// firstTask();
//--------------------------------------------------------------FIRST-------------------------------------------------------------------------------------------------//
export function secondTask() {
  const playerSound = player();

  function colorizeText(text, color) {
    return chalk[color](text);
  }

  function printColoredText(text) {
    const colors = ["red", "green", "yellow", "blue", "magenta", "cyan"];
    let currentIndex = 0;

    for (const char of text) {
      const color = colors[currentIndex % colors.length];
      const coloredChar = colorizeText(char, color);
      process.stdout.write(coloredChar);
      currentIndex++;
    }
    process.stdout.write("\n");
  }

  function playSound(soundFile) {
    playerSound.play(soundFile, function (err) {
      if (err) throw err;
    });
  }

  const userInput = process.argv[2];
  const soundFile = process.argv[3];

  printColoredText(userInput);
  if (soundFile) {
    playSound(soundFile);
  }
}
