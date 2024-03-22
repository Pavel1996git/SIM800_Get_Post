const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

let writeToFile = true; // Флаг для управления записью в файл
let currentFileName = 'data.bin'; // Текущее имя файла

app.use(bodyParser.text({ type: 'text/plain' }));

// Middleware для вывода информации о входящих HTTP-запросах
app.use((req, res, next) => {
  console.log('Received HTTP request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Обработчик POST-запроса для сохранения данных в файл
app.post('/saveData', (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Данные отсутствуют' });
  }

  if (writeToFile) {
    fs.appendFile(currentFileName, data, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Не удалось сохранить данные' });
      }

      // Обработка успешного сохранения данных в файл
      console.log(`Данные успешно записаны в файл ${currentFileName}`);
      res.json({ success: true });
    });
  } else {
    res.json({ success: false, message: 'Запись в файл приостановлена' });
  }
});

// Обработчик POST-запроса для изменения флага записи в файл
app.post('/saveFlag', (req, res) => {
  const flag = req.body;

  if (flag === 'TRUE') {
    writeToFile = true; // Изменение флага на true для возобновления записи
    currentFileName = `data_${uuidv4()}.bin`; // Генерация уникального имени файла
    res.json({ success: true, message: 'Запись в файл возобновлена' });
  } else {
    res.status(400).json({ error: 'Недопустимое значение флага' });
  }
});

// Обработчик GET-запроса для отправки сообщения "GetVan"
app.get('/saveData', (req, res) => {
  res.send('GetVan');
});

// Обработчик GET-запроса для отправки сообщения "GetVan"
app.get('', (req, res) => {
  res.send('GetVan');
});

// Запуск сервера на указанном порту
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});


