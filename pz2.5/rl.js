import fs from "fs";
import path from "path";
import readline from "readline";

export function start() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let currentPath = process.cwd();
  function displayOptions() {
    console.log("=== Файловий менеджер ===");
    console.log("Поточний шлях:", currentPath);
    console.log("Можливості:");
    console.log("1. Переглянути вміст каталогу");
    console.log("2. Перейти до іншого каталогу");
    console.log("3. Створити файл або каталог");
    console.log("4. Переглянути вміст файлу");
    console.log("5. Редагувати файл");
    console.log("6. Перейменувати файл або каталог");
    console.log("7. Видалити файл або каталог");
    console.log("8. Переглянути інформацію про файл або каталог");
    console.log("9. Вийти з програми");
    console.log("=========================");
  }
  function displayDirectoryContents() {
    fs.readdir(currentPath, (err, files) => {
      if (err) {
        console.log("Помилка при отриманні вмісту каталогу:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(currentPath, file);
        const stats = fs.statSync(filePath);
        const fileInfo = `${
          stats.isDirectory() ? "[Каталог] " : "[Файл]    "
        } ${file}`;
        console.log(fileInfo);
      });

      console.log("=========================");
      askForAction();
    });
  }
  function changeDirectory() {
    rl.question("Введіть шлях до каталогу: ", (directoryPath) => {
      const newPath = path.resolve(currentPath, directoryPath);

      fs.stat(newPath, (err, stats) => {
        if (err) {
          console.log("Каталог не існує:", directoryPath);
        } else if (!stats.isDirectory()) {
          console.log("Введений шлях не є каталогом:", directoryPath);
        } else {
          currentPath = newPath;
          console.log("Перехід до каталогу:", currentPath);
          displayOptions();
        }

        askForAction();
      });
    });
  }
  function createFileOrDirectory() {
    rl.question("Введіть назву файлу або каталогу: ", (name) => {
      const newPath = path.resolve(currentPath, name);

      rl.question("Обрати файл (f) чи каталог (d)? ", (type) => {
        if (type.toLowerCase() === "f") {
          fs.writeFile(newPath, "", (err) => {
            if (err) {
              console.log("Помилка при створенні файлу:", err);
            } else {
              console.log("Файл створено:", newPath);
            }

            askForAction();
          });
        } else if (type.toLowerCase() === "d") {
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) {
              console.log("Помилка при створенні каталогу:", err);
            } else {
              console.log("Каталог створено:", newPath);
            }

            askForAction();
          });
        } else {
          console.log('Некоректний вибір типу (використовуйте "f" або "d")');
          askForAction();
        }
      });
    });
  }
  function displayFileContents() {
    rl.question("Введіть назву файлу: ", (fileName) => {
      const filePath = path.resolve(currentPath, fileName);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.log("Помилка при читанні файлу:", err);
        } else {
          console.log("Вміст файлу", filePath);
          console.log("=========================");
          console.log(data);
          console.log("=========================");
        }

        askForAction();
      });
    });
  }
  function editFile() {
    rl.question("Введіть назву файлу: ", (fileName) => {
      const filePath = path.resolve(currentPath, fileName);

      rl.question("Введіть новий текст для файла: ", (newContent) => {
        fs.writeFile(filePath, newContent, (err) => {
          if (err) {
            console.log("Помилка при редагуванні файлу:", err);
          } else {
            console.log("Файл відредаговано:", filePath);
          }

          askForAction();
        });
      });
    });
  }
  function renameFileOrDirectory() {
    rl.question("Введіть назву файлу або каталогу: ", (name) => {
      const oldPath = path.resolve(currentPath, name);

      rl.question("Введіть нову назву: ", (newName) => {
        const newPath = path.resolve(currentPath, newName);

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.log("Помилка при перейменуванні:", err);
          } else {
            console.log("Файл або каталог перейменовано:");
            console.log("Стара назва:", oldPath);
            console.log("Нова назва:", newPath);
          }

          askForAction();
        });
      });
    });
  }
  function deleteFileOrDirectory() {
    rl.question("Введіть назву файлу або каталогу: ", (name) => {
      const filePath = path.resolve(currentPath, name);

      rl.question(
        `Ви дійсно хочете видалити ${filePath}? (так/ні) `,
        (confirmation) => {
          if (confirmation.toLowerCase() === "так") {
            fs.stat(filePath, (err, stats) => {
              if (err) {
                console.log(
                  "Помилка при отриманні інформації про файл або каталог:",
                  err
                );
                askForAction();
                return;
              }

              if (stats.isDirectory()) {
                fs.rmdir(filePath, { recursive: true }, (err) => {
                  if (err) {
                    console.log("Помилка при видаленні каталогу:", err);
                  } else {
                    console.log("Каталог видалено:", filePath);
                  }

                  askForAction();
                });
              } else {
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.log("Помилка при видаленні файлу:", err);
                  } else {
                    console.log("Файл видалено:", filePath);
                  }

                  askForAction();
                });
              }
            });
          } else {
            console.log("Видалення скасовано");
            askForAction();
          }
        }
      );
    });
  }
  function displayFileInfo() {
    rl.question("Введіть назву файлу або каталогу: ", (name) => {
      const filePath = path.resolve(currentPath, name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(
            "Помилка при отриманні інформації про файл або каталог:",
            err
          );
        } else {
          console.log("Інформація про файл або каталог:", filePath);
          console.log("Розмір:", stats.size, "байт");
          console.log("Власник:", stats.uid);
          console.log("Права доступу:", stats.mode.toString(8));
        }

        askForAction();
      });
    });
  }
  function askForAction() {
    rl.question('Введіть номер операції (або "q" для виходу): ', (option) => {
      console.log("=========================");

      if (option === "1") {
        displayDirectoryContents();
      } else if (option === "2") {
        changeDirectory();
      } else if (option === "3") {
        createFileOrDirectory();
      } else if (option === "4") {
        displayFileContents();
      } else if (option === "5") {
        editFile();
      } else if (option === "6") {
        renameFileOrDirectory();
      } else if (option === "7") {
        deleteFileOrDirectory();
      } else if (option === "8") {
        displayFileInfo();
      } else if (option === "9" || option.toLowerCase() === "q") {
        rl.close();
        console.log("До побачення!");
      } else {
        console.log("Некоректний номер операції");
        askForAction();
      }
    });
  }
  console.log("Ласкаво просимо до Файлового менеджера!");
  displayOptions();
  askForAction();
}
