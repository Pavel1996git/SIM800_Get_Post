const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log('Received HTTP request:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  if (req.method === 'POST' && req.url === '/data') {
    const chunks = [];
    let totalBytesReceived = 0; // Переменная для отслеживания общего размера принятых байт

    req.on('data', (chunk) => {
      // Собираем все байты
      chunks.push(chunk);
      totalBytesReceived += chunk.length; // Увеличиваем счетчик на размер полученного куска данных
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
      });

      // Вывод размера принятых байт в консоль
      console.log('Размер принятых байт:', totalBytesReceived);

      // Запись десятичных значений байтов в файл data.txt
      fs.appendFile('data.txt', byteArray.join(','), (err) => {
        if (err) {
          console.error('Ошибка записи в файл data.txt:', err);
        }
      });
    });
  } else if (req.method === 'GET' && req.url === '/getYes') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GetVan');
  } else if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GetZer');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

