const AdminSettings = () => {
    const [maxLoginAttempts, setMaxLoginAttempts] = React.useState("");
    const [blockTime, setBlockTime] = React.useState("");
    const [lockAccessTime, setLockAccessTime] = React.useState("");

    React.useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/update-config');

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            console.log(response)
            setMaxLoginAttempts(response.data.maxLoginAttempts);
            setBlockTime(response.data.blockTime);
            setLockAccessTime(response.data.lockAccessTime);
        } else {
            console.error('Ошибка при загрузке данных', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = () => {
        console.error('Ошибка сети');
    };

    xhr.send();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
        maxLoginAttempts,
        blockTime,
        lockAccessTime,
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/update-config', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            alert('Настройки успешно обновлены!');
        } else {
            console.error('Ошибка при отправке данных', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = () => {
      console.error('Ошибка сети');
    };

    xhr.send(JSON.stringify(data));
  };

    return (
        <div>
            <h4>Настройки администратора</h4>
            <form onSubmit={handleSubmit}>
                <label>
                    Максимальное количество попыток входа:
                    <input 
                        type="number" 
                        value={maxLoginAttempts} 
                        onChange={e => setMaxLoginAttempts(e.target.value)} />
                </label>
                <br />
                <label>
                    Время блокировки (мс):
                    <input 
                        type="number" 
                        value={blockTime} 
                        onChange={e => setBlockTime(e.target.value)} />
                </label>
                <br />
                <label>
                    Время блокировки доступа (мс):
                    <input 
                        type="number" 
                        value={lockAccessTime} 
                        onChange={e => setLockAccessTime(e.target.value)} />
                </label>
                <br />
                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};
