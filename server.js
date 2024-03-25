const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    const chunks = [];

    req.on('data', (chunk) => {
      // Собираем все байты
      chunks.push(chunk);
    });

    req.on('end', () => {
      // Объединяем все байты в один буфер
      const buffer = Buffer.concat(chunks);

      // Записываем данные в файл data.bin
      fs.appendFile('data.bin', buffer, (err) => {
        if (err) {
          console.error('Ошибка записи в файл:', err);
          res.statusCode = 500;
          res.end('Internal Server Error');
        } else {
          console.log('Данные успешно записаны в файл data.bin');
          res.statusCode = 200;
          res.end('Данные успешно записаны');
        }
      });

      // Преобразование буфера в массив чисел
      const byteArray = Array.from(buffer);

      // Вывод десятичных значений байтов в консоль
      console.log('Десятичные значения байтов:');
      byteArray.forEach((byte) => {
        console.log(byte);

        // Запись десятичных значений байтов в файл data.txt через пробел
        fs.appendFile('data.txt', byte.toString() + ' ', (err) => {
          if (err) {
            console.error('Ошибка записи в файл data.txt:', err);
          }
        });
      });
    });
  } else if (req.method === 'GET' && req.url === '/getYes') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GetVan');
    console.log('GetVan');
  } else if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GetZer');
    console.log('GetZer');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

