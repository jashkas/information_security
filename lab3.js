//import fs from 'fs';
const fs = require('fs');

filePath = process.argv[2]==undefined ? "lab3_text.txt" : process.argv[2];

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Произошла ошибка при чтении файла:', err);
        return;
    }

    console.log('Содержимое файла:', data);
    console.log('Разархивированный текст:', decompressLZ77(data));
});

function decompressLZ77(encoded) {
    let output = [];
    let i = 0;

    while (i < encoded.length) {
        if (encoded[i] === '(') {
            i++;  // пропуск открывающей скобки
            let offset = '';
            while (encoded[i] !== ',') {
                offset += encoded[i];
                i++; // пропуск чисел
            }
            i++;  // пропуск запятой
            let length = '';
            while (encoded[i] !== ')') {
                length += encoded[i];
                i++; // пропуск чисел
            }
            i++; // пропуск закрывающей скобки

            offset = parseInt(offset, 10);
            length = parseInt(length, 10);

            if (offset === 69 && length === 5) {
                console.log(offset)
            }

            const startIndex = output.length - offset;
            const endIndex = startIndex + length;

            let symbs = output.slice(startIndex, endIndex);
            // присоединение к выводу
            output.push(...symbs);
            output = checkLast_symbols(output);
        } else {
            output.push(encoded[i]);
            i++;
            output = checkLast_symbols(output);
        }
    }
    // преобразование в строку
    return output.join('');
}

function checkLast_symbols(output) {
    // удаление лишних символов '_'
    let _counter = 0;
    for (c = output.length - 1; c > 0; c--) {
        if (output[c] === '_') {
            _counter++;  // подсчет количества лишних
        } else {
            break;
        }
    }
    for (c = 1; c < _counter; c++) {
        output.pop();  // удаление последних '_', кроме одного
    }
    return output;
}