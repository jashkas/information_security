function decryptVigenere(ciphertext, key, alphabet) {
    //ciphertext = ciphertext.replace(/\s/g, ''); // Удаляем все пробелы из текста
    //key = key.replace(/\s/g, ''); // Удаляем пробелы из ключа для простоты

    let plaintext = '';
    let keyIndex = 0;
    
    for (let i = 0; i < ciphertext.length; i++) {
        const cipherChar = ciphertext[i];
        
        // Пропускаем пробелы
        if (cipherChar === ' ') {
            plaintext += ' ';
            continue;
        }

        const keyChar = key[keyIndex % key.length];
        
        // Индексы символов в алфавите
        const cipherIndex = alphabet.indexOf(cipherChar.toUpperCase());
        const keyIndexInAlphabet = alphabet.indexOf(keyChar.toUpperCase());

        if (cipherIndex !== -1 && keyIndexInAlphabet !== -1) {
            // Рассчитываем индекс расшифрованного символа
            const plainIndex = (cipherIndex - keyIndexInAlphabet + alphabet.length) % alphabet.length;
            const plainChar = alphabet[plainIndex];
            
            plaintext += plainChar;
            
            //console.log('char-' + cipherChar + '; char_i-' + cipherIndex + '; key-' + keyChar + '; key_i-' + keyIndexInAlphabet + '; plain-' + plainChar +'; index-' + plainIndex )
            //console.log('('+cipherIndex+ '-' +keyIndexInAlphabet+ '+' +alphabet.length+') % '+alphabet.length + ' = ' + (cipherIndex - keyIndexInAlphabet + alphabet.length) + '%'+alphabet.length + ' = ' +  (cipherIndex - keyIndexInAlphabet + alphabet.length) % alphabet.length)
            keyIndex++; // Переход к следующему символу ключа
        } else {
            plaintext += cipherChar; // Если символ не в алфавите, просто добавляем его
        }
    }
    console.log(plaintext)
    return plaintext;
}

const ciphertext = 'ДЬЦУЦОЫ ГПЪТТПЦЙ Н ОРЧЕБРМ ТВОЛК ООБЬСАН НПЕЖХСО ЭПЛШФЕЬ';
const key = 'ПОБЕДА'; // П=15, О=14, Б=1, Е=4, Д=3, А=0
console.log('Исходный:' + ciphertext)

alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'; // 33 буквы
alphabet1 = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'; // без Ё

decryptedText = decryptVigenere(ciphertext, key, alphabet);
decryptedText = decryptVigenere(ciphertext, key, alphabet1);