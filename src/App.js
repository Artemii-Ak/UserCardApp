import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import './App.css'; // Подключаем стили для всего приложения

// Основной компонент приложения
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Определяем маршруты для разных компонентов */}
          <Route path="/" element={<UserList />} />
          <Route path="/edit/:id" element={<UserForm />} />
          <Route path="/create" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
