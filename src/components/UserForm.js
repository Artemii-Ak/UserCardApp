import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UserForm.css'; // Подключаем стили для компонента формы пользователя

// Компонент формы пользователя
function UserForm() {
  const { id } = useParams(); // Получаем id из URL параметров
  const navigate = useNavigate(); // Для навигации после сохранения
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    birthDate: '',
    job: '',
    cards: []
  });

  // Загрузка данных о пользователе, если id задан
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost/GetUser?id=${id}`)
        .then(response => setUser(response.data.data))
        .catch(error => console.error(error));
    }
  }, [id]);

  // Обработчик изменений в полях формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  // Обработчик изменений в полях формы карты
  const handleCardChange = (index, e) => {
    const { name, value } = e.target;
    const newCards = [...user.cards];
    newCards[index][name] = value;
    setUser(prevState => ({ ...prevState, cards: newCards }));
  };

  // Добавление новой карты
  const addCard = () => {
    setUser(prevState => ({
      ...prevState,
      cards: [...prevState.cards, { id: 0, number: '', fullName: '', expDate: '', cvc: '' }]
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id ? `http://localhost/updateuser` : `http://localhost/createuser`;
    const method = id ? 'put' : 'post';
    axios[method](url, user)
      .then(response => navigate('/'))
      .catch(error => console.error(error));
  };

  return (
    <div className="user-form">
      <h1>{id ? 'Редактирование пользователя' : 'Создание пользователя'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ФИО:</label>
          <input type="text" name="firstName" placeholder="Фамилия" value={user.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Имя" value={user.lastName} onChange={handleChange} required />
          <input type="text" name="patronymic" placeholder="Отчество" value={user.patronymic} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Дата рождения:</label>
          <input type="date" name="birthDate" value={user.birthDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Место работы:</label>
          <input type="text" name="job" placeholder="Организация" value={user.job} onChange={handleChange} required />
        </div>
        {/* Отображение списка карт */}
        {user.cards.map((card, index) => (
          <div key={index} className="form-group">
            <label>Номер счета:</label>
            <input type="text" name="number" placeholder="20 цифр" value={card.number} onChange={(e) => handleCardChange(index, e)} required />
            <label>ФИО владельца:</label>
            <input type="text" name="fullName" placeholder="Латинскими буквами" value={card.fullName} onChange={(e) => handleCardChange(index, e)} required />
            <label>Срок действия:</label>
            <input type="text" name="expDate" placeholder="01/99" value={card.expDate} onChange={(e) => handleCardChange(index, e)} required />
            <label>CVC:</label>
            <input type="text" name="cvc" placeholder="000" value={card.cvc} onChange={(e) => handleCardChange(index, e)} required />
          </div>
        ))}
        <button type="button" onClick={addCard} className="btn btn-secondary">Добавить карту</button>
        <button type="submit" className="btn btn-primary">Сохранить</button>
      </form>
    </div>
  );
}

export default UserForm;
