const fs = require('fs').promises;
const path = require('path');

// Путь к файлу журнала аудита
const auditLogFilePath = path.join(__dirname, 'auditLog.json');

// Функция для инициализации журнала, если он не существует
async function initializeLogFile() {
    try {
        await fs.access(auditLogFilePath);
    } catch {
        // Если файл не существует, создаем новый пустой файл
        await fs.writeFile(auditLogFilePath, JSON.stringify([], null, 2));
    }
}

// Функция для записи события в журнал аудита
async function logEvent(eventData) {
    await initializeLogFile(); // Убедимся, что файл существует
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        ...eventData
    };

    try {
        const data = await fs.readFile(auditLogFilePath, 'utf8');
        const logEntries = JSON.parse(data || '[]'); // Парсим если файл не пустой
        logEntries.push(logEntry);
        await fs.writeFile(auditLogFilePath, JSON.stringify(logEntries, null, 2));
        console.log('Событие записано в журнал аудита:', logEntry);
    } catch (err) {
        console.error('Ошибка при записи в журнал аудита:', err);
    }
}

// Функция логирования системных событий
async function logSystemEvent(eventType, userLogin = "system", workstationId = "N/A") {
    const eventData = {
        eventType,
        userLogin,
        workstationId,
    };
    await logEvent(eventData); // Запись события в лог
}

// Логируем запуск системы
logSystemEvent("system_start");

// Обработка сигналов для остановки системы
process.on('SIGINT', async () => {
    await logSystemEvent("system_stop"); // Логируем остановку системы
    process.exit(0); // Завершение процесса
});

process.on('SIGTERM', async () => {
    await logSystemEvent("system_stop"); // Логируем остановку системы
    process.exit(0); // Завершение процесса
});

module.exports = { logEvent, logSystemEvent };