const fs = require('fs');

/**
 * Декодирует сжатые данные, используя дерево Хаффмана.
 * @param {string} compressedData - Бинарная строка закодированных данных.
 * @param {Object} codeMap - Карта кодов Хаффмана (символ -> бинарный код).
 * @returns {string} Декодированный текст.
 */
function huffmanDecompress(compressedData, codeMap) {
    const inverseCodeMap = new Map();
    // Строим обратную карту кодов (бинарный код -> символ)
    for (const [char, code] of codeMap.entries()) {
        inverseCodeMap.set(code, char);
    }

    let currentCode = '';
    let decodedText = '';

    // Проходим побитно по сжатым данным
    for (const bit of compressedData) {
        currentCode += bit;
        // Проверяем, известен ли текущий код в обратной карте
        if (inverseCodeMap.has(currentCode)) {
            decodedText += inverseCodeMap.get(currentCode);
            currentCode = ''; // Сбрасываем текущий код
        }
    }

    return decodedText;
}

/**
 * Читает данные и кодовую карту из файла.
 * @param {string} filePath - Путь к файлу с закодированными данными.
 * @returns {Object} Объект с кодовыми данными и картой кодов.
 */
function readCompressedFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parts = JSON.parse(content); // Файл предположительно содержит JSON
    return {
        compressedData: parts.compressedData,
        codeMap: new Map(Object.entries(parts.codeMap))
    };
}

// Usage example
const filePath = 'lab3_text_compress_Huffman.json';

// Загружаем сжатые данные и карту кодов
const { compressedData, codeMap } = readCompressedFile(filePath);

// Декодируем данные
const decodedText = huffmanDecompress(compressedData, codeMap);

console.log('Decoded text:', decodedText);