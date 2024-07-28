import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserList.css'; // Подключаем стили для компонента списка пользователей

// Компонент списка пользователей
function UserList() {
  const [users, setUsers] = useState([]);

  // Загрузка данных о пользователях при монтировании компонента
  useEffect(() => {
    axios.get('http://localhost:80/getusers')
      .then(response => setUsers(response.data.data))
      .catch(error => console.error(error));
  }, []);

  // Удаление пользователя
  const deleteUser = (id) => {
    axios.delete(`http://localhost/DeleteUser?id=${id}`)
      .then(response => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div className="user-list">
      <h1>Список пользователей</h1>
      <Link to="/create" className="btn btn-primary">Создать нового пользователя</Link>
      <ul>
        {/* Отображение списка пользователей */}
        {users.map(user => (
          <li key={user.id} className="user-item">
            {user.firstName} {user.lastName}
            <button onClick={() => deleteUser(user.id)} className="btn btn-danger">Удалить</button>
            <Link to={`/edit/${user.id}`} className="btn btn-secondary">Редактировать</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
