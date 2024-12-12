const { execFile } = require('child_process');
const path = require('path');

const encryptMessage = 'ШОГЖСРЫЗФХЯНЁ';
// Превращаем строку в буфер в кодировке UTF-8
const utf8Buffer = Buffer.from(encryptMessage, 'utf8');

// Формируем путь к файлу `caesar.py`
const scriptPath = path.join(__dirname, 'caesar.py');

// Запускаем python-скрипт и передаем ему зашифрованное сообщение
// -u буферизация
execFile('python', ['-u', scriptPath, utf8Buffer], { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
        console.error(`Ошибка выполнения скрипта: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Ошибка в скрипте Python: ${stderr}`);
        return;
    }
    console.log(`Расшифрованные варианты:\n${stdout}`);
});