import csv from "csv-parser";
import fs from "fs";
import path from "path";

export function startTwoSeven() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Введіть шлях до csv-файлу або назву файла");
    process.exit(1);
  }

  if (!filePath.endsWith(".csv")) {
    console.log("Вказаний файл не є csv-файлом");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.log("Файл не існує");
    process.exit(1);
  }

  const outputFilePath = path.join(
    path.dirname(filePath),
    `${path.basename(filePath, ".csv")}.js`
  );

  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const fileContent = `module.exports = ${JSON.stringify(
        results,
        null,
        2
      )};`;

      fs.writeFile(outputFilePath, fileContent, (err) => {
        if (err) {
          console.log("Помилка при записі вихідного файлу:", err);
        } else {
          console.log("Файл успішно перетворено та збережено:", outputFilePath);
        }
      });
    });
}
