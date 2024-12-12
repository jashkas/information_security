const fs = require('fs');
const path = require('path');

/**
 * Читает содержимое файла.
 * @param {string} filePath - Путь к файлу, который необходимо прочитать.
 * @returns {string} Содержимое файла.
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

// Класс, представляющий узел дерева Хаффмана
class HuffmanNode {
    /**
     * Конструктор для создания нового узла дерева Хаффмана.
     * @param {string|null} character - Символ, который хранится в узле (или null для внутренних узлов).
     * @param {number} frequency - Частота символа в исходном тексте.
     */
    constructor(character, frequency) {
        this.character = character; // Символ
        this.frequency = frequency; // Частота символа
        this.left = null;           // Левый дочерний узел
        this.right = null;          // Правый дочерний узел
    }
}

/**
 * Создает дерево Хаффмана на основе частот символов в тексте.
 * @param {string} text - Исходный текст.
 * @returns {HuffmanNode} Корень дерева Хаффмана.
 */
function buildHuffmanTree(text) {
    const frequencyMap = new Map();
    
    // Подсчет частот для каждого символа в тексте
    for (const char of text) {
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }

    // Инициализируем очередь с учетом частот символов
    const priorityQueue = Array.from(frequencyMap.entries()).map(
        ([char, freq]) => new HuffmanNode(char, freq)
    ).sort((a, b) => a.frequency - b.frequency);

    // Построение дерева Хаффмана
    while (priorityQueue.length > 1) {
        const left = priorityQueue.shift();  // Извлекаем узел с наименьшей частотой
        const right = priorityQueue.shift(); // Извлекаем следующий узел с наименьшей частотой

        // Создание нового внутреннего узла
        const newNode = new HuffmanNode(null, left.frequency + right.frequency);
        newNode.left = left;
        newNode.right = right;
        
        // Добавление нового узла обратно в очередь
        priorityQueue.push(newNode);
        priorityQueue.sort((a, b) => a.frequency - b.frequency);
    }

    return priorityQueue[0]; // Возвращаем корень дерева
}

/**
 * Рекурсивно создает коды Хаффмана для каждого символа.
 * @param {HuffmanNode} node - Узел, для которого создается код.
 * @param {string} prefix - Текущий префикс кода.
 * @param {Map<string, string>} codeMap - Карта символов и их кодов Хаффмана.
 * @returns {Map<string, string>} Обновленная карта кодов Хаффмана.
 */
function buildHuffmanCodes(node, prefix = '', codeMap = new Map()) {
    if (node.character !== null) {
        codeMap.set(node.character, prefix); // Записываем код для символа
        return codeMap;
    }
    if (node.left) {
        buildHuffmanCodes(node.left, prefix + '0', codeMap); // Рекурсивно обрабатываем левый подузел
    }
    if (node.right) {
        buildHuffmanCodes(node.right, prefix + '1', codeMap); // Рекурсивно обрабатываем правый подузел
    }
    return codeMap;
}

/**
 * Сжимает текст с использованием алгоритма Хаффмана.
 * @param {string} text - Исходный текст.
 * @returns {Object} Объект, содержащий сжатые данные и карту кодов.
 */
function huffmanCompress(text) {
    const tree = buildHuffmanTree(text); // Строим дерево Хаффмана
    const codeMap = buildHuffmanCodes(tree); // Создаем карту кодов

    let compressedData = '';
    for (const char of text) {
        compressedData += codeMap.get(char); // Преобразуем текст в последовательность кодов
    }
    return { compressedData, codeMap };
}

/**
 * Пишет данные в файл.
 * @param {string} filePath - Путь к файлу, в который будут записаны данные.
 * @param {string} data - Данные для записи.
 */
function writeFile(filePath, data) {
    fs.writeFileSync(filePath, data, 'utf8');
}

/**
 * Вычисляет размер данных в байтах.
 * @param {string} data - Данные, для которых вычисляется размер.
 * @returns {number} Размер данных в байтах.
 */
function calculateFileSize(data) {
    return Buffer.byteLength(data, 'utf8');
}

/**
 * Основная функция обработки файлов: чтение, сжатие, запись.
 * @param {string} inputFilePath - Путь к исходному файлу.
 * @param {string} outputFilePath - Путь к файлу для сохранения сжатых данных.
 */
function processFiles(inputFilePath, outputFilePath) {
    try {
        const originalText = readFile(inputFilePath); // Чтение исходного текста
        console.log(`Исходный текст: ${originalText}`); // Печать исходного текста для отладки

        const originalSize = calculateFileSize(originalText); // Рассчитываем размер исходного файла

        const { compressedData, codeMap } = huffmanCompress(originalText); // Сжимаем текст
        console.log(`Сжатые данные: ${compressedData}`); // Печать сжатых данных для отладки

        const compressedSize = Math.ceil((compressedData.length) / 8); // Вычисляем размер сжатого файла

        sizeInBytes = -1;

        if (compressedData.length > 0) {
            writeFile('lab3_text_compress_Huffman.txt', compressedData);
            const codeMapObject = Object.fromEntries(codeMap); // Преобразуем Map в объект
            const jsonOutput = JSON.stringify({ compressedData, codeMap: codeMapObject }, null, 2);

            // Используем TextEncoder для преобразования строки в массив байтов (UTF-8).
            const encoder = new TextEncoder();
            encodedBytes = encoder.encode(jsonOutput);
            // Подсчитываем количество байтов
            sizeInBytes = encodedBytes.length;
            // Запись JSON-объект с двумя ключами: 
            // compressedData (строка бинарных данных)
            // и codeMap (мапа символов и их соответствующих бинарных кодов)
            writeFile(outputFilePath, jsonOutput);

            console.log(`Файл успешно записан: ${outputFilePath}`); // Сообщение об успешной записи
        } else {
            throw new Error('Сжатые данные пустые'); // Исключение в случае ошибки сжатия
        }

        console.log(`Размер исходного файла: ${originalSize} байт`);
        console.log(`Размер сжатого файла: ${compressedSize} байт`); // Сообщаем о размере файлов
    } catch (error) {
        console.error(`Ошибка: ${error.message}`); // Обработка и вывод ошибок
    }
}

// Указываем пути к входному и выходному файлам
const inputFilePath = path.join(__dirname, 'lab3_text_decompressLZ77.txt');
const outputFilePath = path.join(__dirname, 'lab3_text_compress_Huffman.json');

// Запускаем процесс обработки файлов
processFiles(inputFilePath, outputFilePath);