import path from "path";
import os from "os";

export function thirdTask() {
  const userInput = process.argv[2];

  const fullPath = path.resolve(userInput);

  const fileName = path.basename(fullPath);

  const fileExtension = path.extname(fullPath);

  const platform = os.platform();

  new Promise(() => {
    console.log("Повний шлях:", fullPath);
  })
    .then(console.log("Назва файлу:", fileName))
    .then(console.log("Розширення файлу:", fileExtension))
    .then(console.log("Вид сімейства операційної системи:", platform));
}
