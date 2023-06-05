import readline from "readline";
import fs from "fs";

export function TwoSevenPartTwo() {
  const filename = "D:/JABASCRIPT/jss/pz2.7/capital_country.csv";

  function loadQuestions(filename) {
    const questions = [];
    const fileData = fs.readFileSync(filename, "utf8");
    const lines = fileData.split("\n");
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");

      const question = {};
      for (let j = 0; j < headers.length; j++) {
        question[headers[j]] = currentLine[j];
      }

      questions.push(question);
    }

    return questions;
  }

  function askQuestion(rl, question) {
    return new Promise((resolve, reject) => {
      rl.question(
        `${question.question} (Level: ${getLevelName(question.partsWorld)})\n`,
        (answer) => {
          const isCorrect =
            answer.trim().toLowerCase() ===
            question.correctAnswer.trim().toLowerCase();
          resolve(isCorrect);
        }
      );
    });
  }

  function getLevelName(level) {
    switch (level) {
      case "1":
        return "Європа";
      case "2":
        return "Азія";
      case "3":
        return "Південна Америка";
      case "4":
        return "Африка";
      default:
        return "Невідомий рівень";
    }
  }

  function playGame(questions) {
    let totalQuestions = 0;
    let correctAnswers = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function askName() {
      return new Promise((resolve, reject) => {
        rl.question("Введіть ваше ім'я або логін: ", (name) => {
          resolve(name);
        });
      });
    }

    function askPlayAgain() {
      return new Promise((resolve, reject) => {
        rl.question("Бажаєте продовжити гру? (Так або Ні): ", (answer) => {
          resolve(answer.toLowerCase() === "так");
        });
      });
    }

    async function askQuestions() {
      const shuffledQuestions = shuffleArray(questions);
      for (const question of shuffledQuestions) {
        console.log(`\nLevel: ${getLevelName(question.partsWorld)}`);
        const isCorrect = await askQuestion(rl, question);
        if (isCorrect) {
          correctAnswers++;
        } else {
          rl.close();
          endGame(totalQuestions, correctAnswers);
          return;
        }
        totalQuestions++;
      }

      rl.close();
      endGame(totalQuestions, correctAnswers);
    }

    async function startGame() {
      const name = await askName();
      console.log(`\nПочинаємо гру, ${name}!`);
      await askQuestions();

      const playAgain = await askPlayAgain();
      if (playAgain) {
        console.log("\n-----------------\n");
        playGame(questions);
      }
    }

    startGame();
  }

  function endGame(totalQuestions, correctAnswers) {
    console.log(
      `\nГра закінчена! Результат: Задано запитань: ${totalQuestions}, Правильних відповідей: ${correctAnswers}`
    );

    const logData = `${new Date().toLocaleString()}, Задано запитань: ${totalQuestions}, Правильних відповідей: ${correctAnswers}\n`;
    fs.appendFileSync("user.log", logData, "utf8");

    updateLevelLog(totalQuestions, correctAnswers);
  }

  function updateLevelLog(totalQuestions, correctAnswers) {
    const levelLogPath = "level.log";
    let levelLog = "";

    if (fs.existsSync(levelLogPath)) {
      levelLog = fs.readFileSync(levelLogPath, "utf8");
    }

    const levelStats = {
      1: { asked: 0, correct: 0 },
      2: { asked: 0, correct: 0 },
      3: { asked: 0, correct: 0 },
      4: { asked: 0, correct: 0 },
    };

    // Extract existing stats from level.log
    const lines = levelLog.trim().split("\n");
    for (const line of lines) {
      const [level, asked, correct] = line.split(", ");
      levelStats[level].asked = parseInt(asked);
      levelStats[level].correct = parseInt(correct);
    }

    // Update stats with current game results
    for (let i = 1; i <= 4; i++) {
      if (totalQuestions > 0) {
        if (levelStats[i]) {
          levelStats[i].asked += totalQuestions;
          levelStats[i].correct += Math.floor(
            (correctAnswers / totalQuestions) * totalQuestions
          );
        } else {
          levelStats[i] = {
            asked: totalQuestions,
            correct: Math.floor(
              (correctAnswers / totalQuestions) * totalQuestions
            ),
          };
        }
      }
    }

    // Generate the updated level.log content
    let updatedLevelLog = "";
    for (let i = 1; i <= 4; i++) {
      updatedLevelLog += `Рівень ${getLevelName(i)} - Задано: ${
        levelStats[i].asked
      }, Правильних: ${levelStats[i].correct}\n`;
    }

    // Write the updated level.log
    fs.writeFileSync(levelLogPath, updatedLevelLog.trim(), "utf8");

    function shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    const questions = loadQuestions(filename);
    playGame(questions);
  }
}
