// главный компонент
function Main(props) {
    let [logList, setLogList] = React.useState([]); // список логов
    let [isLoggedIn, setIsLoggedIn] = React.useState(false); // Состояние для отслеживания входа
    let [isAdmin, setIsAdmin] = React.useState(false); // Состояние для отслеживания администратора
    const [lockAccessTime, setLockAccessTime] = React.useState(1800000);
    let inactivityTime = null;

    

    // Функция для получения логов
    let getAuditLogs = () => {
        let request = new XMLHttpRequest();
        request.open("GET", "/auditLogs");

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                const logs = JSON.parse(request.responseText);
                setLogList(logs); // Сохраняем логи в состояние
            } else {
                console.error("Ошибка при получении логов:", request.responseText);
            }
        };

        request.onerror = function () {
            console.error("Ошибка запроса на получение логов");
        };

        request.send();
    }

    const handleLogin = (loggedInStatus, adminStatus) => {
        setIsLoggedIn(loggedInStatus);
        setIsAdmin(adminStatus); // Устанавливаем статус администратора
    };

    return (<div>
            <User
                onLogin={handleLogin}
                onLoadLogs={getAuditLogs}
            />
            {isAdmin && <AdminSettings />}
            {(isLoggedIn) && <LogList logs={logList}/>}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<Main/>);