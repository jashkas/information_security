//import fs from 'fs';
const fs = require('fs');

filePath = process.argv[2]==undefined ? "lab3_text.txt" : process.argv[2];
/*
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Произошла ошибка при чтении файла:', err);
        return;
    }

    console.log('Содержимое файла:', data);
    sizeFile(filePath);

    new_data = decompressLZ77(data)
    filePath = 'lab3_text_decompressLZ77.txt'
    fs.writeFile('lab3_text_decompressLZ77.txt', new_data, (err) => {
        if (err) {
            console.error('Произошла ошибка при записи файла:', err);
            return;
        }
    });
    fs.readFile('lab3_text_decompressLZ77.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Произошла ошибка при чтении файла:', err);
            return;
        }
    
        console.log('Разархивированный текст:', data);
        sizeFile(filePath);
    });
});
*/
console.log('№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№№')

filePath = process.argv[2]==undefined ? "lab3_text.txt" : process.argv[2];
var data = fs.readFileSync(filePath, 'utf8');
console.log('Содержимое файла2:', data);
var data_size = fs.statSync(filePath, 'utf8');
console.log(`Размер файла: ${data_size.size} байт`)

filePath = 'lab3_text_decompressLZ77.txt';
data = decompressLZ77(data);
fs.writeFileSync(filePath, data);
console.log('Разархивированный текст:', data);
data_size = fs.statSync(filePath, 'utf8');
console.log(`Размер файла: ${data_size.size} байт`)



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

function sizeFile(filePath) {
    fs.statSync(filePath, 'utf8', (err, stats) => {
        if (err) {
            console.error('Ошибка при получении информации о файле:', err);
            return;
        }
        console.log(`Размер файла: ${stats.size} байт`);
    });
}

function readFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Произошла ошибка при чтении файла:', err);
            return;
        }
        return data;
    });
}

function writeFile(filePath='lab3_text_decompressLZ77.txt', data) {
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Произошла ошибка при записи файла:', err);
            return;
        }
    });
}