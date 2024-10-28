// cmd: npm install express

const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const { logEvent, logSystemEvent } = require('./auditLog');

app.use(express.static('public'));

// Путь к файлу пользователей
const usersFilePath = path.join(__dirname, 'users.json');
const configPath = path.join(__dirname, './config.json');

const config = require('./config.json');
const MAX_LOGIN_ATTEMPTS = config.maxLoginAttempts; // Загрузка из конфигурации
const BLOCK_TIME = config.blockTime; // Время блокировки

const blockedUsers = {}; // Объект для хранения состояния заблокированных пользователей

app.use(express.json()); // Используем middleware для парсинга JSON

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

// Аутентификация пользователей
app.post("/auth", (request, response) => {
    const { login, password } = request.body;

    // Проверяем, заблокирован ли пользователь
    if (blockedUsers[login] && Date.now() < blockedUsers[login].blockUntil) {
        return response.status(403).send("Учетная запись заблокирована. Попробуйте позже.");
    }

    // Чтение файла users.json
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return response.status(500).send("Ошибка сервера.");
        }
        
        // Преобразуем JSON в объект
        const users = JSON.parse(data);

        // Проверяем, соответствует ли один из пользователей введённым данным
        const userFound = users.find(user => user.login === login && user.password === password);

        if (userFound) {
            // Логируем успешный вход
            logEvent({
                eventType: 'user_authorize',
                userLogin: login,
                workstationId: request.headers['user-agent']
            });
            delete blockedUsers[login]; // Сбрасываем количество неудачных попыток при успешном входе
            return response.json({
                message: "Вы вошли успешно",
                login: userFound.login,
                isAdmin: userFound.admin // Передаем статус администратора
            });
        } else {
            if (!blockedUsers[login]) {
                blockedUsers[login] = { attempts: 0, blockUntil: null };
            }
            blockedUsers[login].attempts += 1;

            if (blockedUsers[login].attempts >= MAX_LOGIN_ATTEMPTS) {
                blockedUsers[login].blockUntil = Date.now() + BLOCK_TIME;
                logEvent({ 
                    eventType: 'account_blocked' + " причина: Превышен лимит неверного входа", 
                    userLogin: login, 
                    workstationId: request.headers['user-agent'] });
                return response.status(403).send("Учетная запись заблокирована на 30 минут.");
            }
            // Логируем неудачную попытку входа
            logEvent({
                eventType: 'unauthorized_access_attempt',
                userLogin: login,
                workstationId: request.headers['user-agent'],
            });
            //console.log(`Неудачная попытка входа: ${login}`);
            return response.status(401).send("Неверный логин или пароль.");
        }
    });
});

app.post("/logout", (request, response) => {
    const { login } = request.body;

    // Логируем событие выхода
    logEvent({
        eventType: 'user_logout',
        userLogin: login,
        workstationId: request.headers['user-agent']
    });

    response.send("Вы вышли успешно.");
});

// Проверка прав администратора
const checkAdmin = (request, response, next) => {
    const user = request.user; // Предполагается, что пользователь ставится в req.user после аутентификации
    if (user && user.admin) {
        next(); // Если пользователь администратор, продолжаем
    } else {
        response.status(403).send("Доступ запрещен");
    }
};
// Запрос на обновление конфигурации
app.post('/update-config', (request, response) => {
    const { maxLoginAttempts, blockTime, lockAccessTime } = request.body;
    
    // Чтение текущего конфигурационного файла
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) return response.status(500).send("Ошибка чтения конфигурации");

        let config = JSON.parse(data);

        // Изменение значений в конфигурации
        if (maxLoginAttempts !== undefined) config.maxLoginAttempts = maxLoginAttempts;
        if (blockTime !== undefined) config.blockTime = blockTime;
        if (lockAccessTime !== undefined) config.lockAccessTime = lockAccessTime;

        // Запись обновленной конфигурации обратно в файл
        fs.writeFile(configPath, JSON.stringify(config, null, 4), err => {
            if (err) return response.status(500).send("Ошибка записи конфигурации");
            response.send("Конфигурация успешно обновлена");
        });
    });
});
// Запрос на чтение конфигурации
app.get('/update-config', (request, response) => {
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            return response.status(500).json({
                status: 'error',
                message: 'Ошибка чтения конфигурации'
            });
        }
        
        let config;
        try {
            config = JSON.parse(data);
        } catch (parseErr) {
            return response.status(400).json({
                status: 'error',
                message: 'Ошибка парсинга конфигурации'
            });
        }

        response.status(200).json({
            status: 'success',
            data: {
                maxLoginAttempts: config.maxLoginAttempts,
                blockTime: config.blockTime,
                lockAccessTime: config.lockAccessTime
            }
        });
    });
});

// Получение логов
app.get("/auditLogs", (request, response) => {
    fs.readFile('auditLog.json', 'utf8', (err, data) => {
        if (err) {
            return response.status(500).send("Ошибка сервера.");
        }

        // Преобразуем JSON в объект
        const logs = JSON.parse(data);
        response.json(logs); // Отправляем логи в формате JSON
    });
})

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000/');
});

