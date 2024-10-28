// компонент логов
function LogList({ logs }) {
    // создадим объект со стилями css
    let tbl = {
        border: '3px solid #5CCCCC',
        borderCollapse: 'collapse',
        width: '100%'
    }
    let cell = {
        border: '2px solid #5CCCCC',
        backgroundColor: '#FFB273',
        textAlign: 'left'
    }
    let cellHeader = {
        border: '2px solid #5CCCCC',
        backgroundColor: '#FFB273',
        textAlign: 'center'
    }

    // состояния для хранения поискового запроса, поля сортировки и границ дат
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortField, setSortField] = React.useState('timestamp'); // Поле по умолчанию
    const [sortOrder, setSortOrder] = React.useState('asc'); // По возрастанию
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    // обработчик изменения ввода
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        const [field, order] = event.target.value.split(',');
        setSortField(field);
        setSortOrder(order);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    // фильтруем логи по запросу
    const filteredLogs = logs.filter(log => {
        const isWithinDateRange = (!startDate || new Date(log.timestamp) >= new Date(startDate)) &&
                                   (!endDate || new Date(log.timestamp) <= new Date(endDate));
        const matchesSearchTerm = log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   log.userLogin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   log.workstationId.toLowerCase().includes(searchTerm.toLowerCase());
        return isWithinDateRange && matchesSearchTerm;
    });

    // сортируем логи
    const sortedLogs = filteredLogs.sort((a, b) => {
        const aValue = (sortField === 'timestamp') ? new Date(a[sortField]) : a[sortField];
        const bValue = (sortField === 'timestamp') ? new Date(b[sortField]) : b[sortField];
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return (
        <div>
            <input 
                type="text" 
                placeholder="Поиск..." 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <select onChange={handleSortChange}>
                <option value="timestamp,asc">Сортировать время по возрастанию</option>
                <option value="timestamp,desc">Сортировать время по убыванию</option>
                <option value="eventType,asc">Сортировать событие по возрастанию</option>
                <option value="eventType,desc">Сортировать событие по убыванию</option>
                <option value="userLogin,asc">Сортировать пользователей по возрастанию</option>
                <option value="userLogin,desc">Сортировать пользователей по убыванию</option>
                <option value="workstationId,asc">Сортировать рабочие станции по возрастанию</option>
                <option value="workstationId,desc">Сортировать рабочие станции по убыванию</option>
            </select>
            <div>
                <label>
                    Start Date: 
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
                </label>
                <label>
                    End Date: 
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
                </label>
            </div>
            <table style={tbl}>
                <tr>
                    <th style={cellHeader} colSpan={4}>Логи</th>
                </tr>
                <tr>
                    <td style={cellHeader}>Время</td>
                    <td style={cellHeader}>Событие</td>
                    <td style={cellHeader}>Логин</td>
                    <td style={cellHeader}>Рабочая станция</td>
                </tr>
                {filteredLogs.length > 0 ? (
                    filteredLogs.map(function(log, index) {
                        return <tr key={index}>
                            <td style={cell}>{log.timestamp}</td>
                            <td style={cell}>{log.eventType}</td>
                            <td style={cell}>{log.userLogin}</td>
                            <td style={cell}>{log.workstationId}</td>
                        </tr>
                    })
                ) : (
                    <tr>
                        <td style={cell} colSpan={4}>Нет доступных логов.</td>
                    </tr>
                )}
            </table>
        </div>
    )
}
