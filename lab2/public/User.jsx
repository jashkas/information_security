// компонент пользователя
function User({ onLogin, onLoadLogs }) {
    let [login, setLogin] = React.useState("");
    let [password, setPassword] = React.useState("");
    let [isAuthenticated, setIsAuthenticated] = React.useState(false); // Состояние авторизации
    let [errorMessage, setErrorMessage] = React.useState(""); // Сообщение об ошибке
    
    let loginInputRef = React.useRef(null);  // ссылка на текстовое поле
    let passwordInputRef = React.useRef(null);  // ссылка на текстовое поле

    // метод отправки данных на сервер
    let sendUser = () => {
        let log = loginInputRef.current.value;
        let pas = passwordInputRef.current.value;
        if (log && pas) {
            // Создаем объект пользователя
            let user = {
                login: log,
                password: pas
            };

            // Очищаем поля ввода
            loginInputRef.current.value = "";
            passwordInputRef.current.value = "";

            // Создаем запрос
            let request = new XMLHttpRequest();
            request.open("POST", "/auth");
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            // Получение данных
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    console.log(request.responseText);
                    const userResponse = JSON.parse(request.responseText);
                    setIsAuthenticated(true); // Устанавливаем состояние авторизации в true
                    setLogin(userResponse.login); // Сохраняем логин в состоянии

                    // Сохраняем информацию об администраторе
                    onLogin(true, userResponse.isAdmin); // Передаем состояние администратор/не администратор
                    //onLogin(true); // Устанавливаем состояние в true при успешном входе
                    onLoadLogs(); // Запрос на получение логов
                    setErrorMessage("");
                } else if (request.status == 403) {
                    setErrorMessage(request.responseText);
                    onLogin(false, false); // Устанавливаем состояние в false
                } else {
                    console.error("Ошибка при входе:", request.responseText);
                    setErrorMessage("Неверный логин или пароль."); // Устанавливаем сообщение об ошибке
                    onLogin(false, false); // Устанавливаем состояние в false
                }
            }

            // Обработка ошибок
            request.onerror = () => {
                console.error("Ошибка при отправке запроса");
                setErrorMessage("Ошибка сервера. Попробуйте позже."); // Устанавливаем сообщение об ошибке
            };

            // Отправляем данные
            request.send(JSON.stringify(user));
        } else {
            console.error("Логин и пароль не могут быть пустыми");
            setErrorMessage("Логин и пароль не могут быть пустыми."); // Устанавливаем сообщение об ошибке
        }
    }

    const handleLogout = () => {
        // Создаем запрос на логирование выхода
        let request = new XMLHttpRequest();
        request.open("POST", "/logout");
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        // Получение данных после логирования
        request.onload = () => {
            if (request.status >= 200 && request.status < 300) {
                console.log("Выход выполнен успешно.");
            } else {
                console.error("Ошибка при логировании выхода:", request.responseText);
            }
        };

        // Обработка ошибок
        request.onerror = () => {
            console.error("Ошибка при отправке запроса на выход");
        };

        // Отправляем информацию о выходе
        request.send(JSON.stringify({ login }));
        
        // Сбрасываем состояние авторизации
        setIsAuthenticated(false); // Сбросить состояние авторизации
        onLogin(false); // Устанавливаем состояние в false
    };

    return (<div>
            {isAuthenticated ? (
                <div>
                    {login}
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            ) : (
                <div>
                    <input type='text' placeholder='Логин' ref={loginInputRef} />
                    <input type='password' placeholder='Пароль' ref={passwordInputRef} />
                    <button onClick={sendUser}>Войти</button>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Сообщение об ошибке */}
                </div>
            )}
        </div>
    );
}
