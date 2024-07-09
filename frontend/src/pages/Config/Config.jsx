import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './Config.scss';
import { AuthContext } from '../../context/AuthContext';

const Config = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const validate = (name, value) => {
    switch (name) {
      case 'username':
        return value.length >= 5 ? "" : "El nombre de usuario debe tener al menos 5 caracteres";
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(value) ? "" : "El correo electrónico no es válido";
      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(value) ? "" : "La contraseña debe tener al menos 6 caracteres, incluyendo al menos 1 letra y 1 número";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleUpdate = async (field) => {
    const data = {};
    const error = validate(field, formData[field]);

    if (error) {
      setErrors({ ...errors, [field]: error });
      return;
    }

    if (field === 'username') data.username = formData.username;
    if (field === 'email') data.email = formData.email;
    if (field === 'password') data.password = formData.password;

    try {
      const token = Cookies.get('jwToken');
      await axios.put(`http://localhost:3000/users/update/${userId}`, data, {
        headers: {
          'token': `${token}`
        }
      });
      setMessage(`Editar exitoso`);
    } catch (error) {
      setMessage(`Hubo un error al editar: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = Cookies.get('jwToken');
      await axios.delete(`http://localhost:3000/users/delete/${userId}`, {
        headers: {
          'token': `${token}`
        }
      });
      logoutUser();
      navigate('/access');
    } catch (error) {
      setMessage(`Hubo un error al eliminar: ${error.message}`);
    }
  };

  return (
    <section>
      <h2>Configuración</h2>
      <div className="config">
        <div className="new-usuario">
          <h3>Usuario</h3>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p>{errors.username}</p>}
          <button onClick={() => handleUpdate('username')}>Actualizar Username</button>
        </div>
        <div className="new-email">
          <h3>Email</h3>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
          <button onClick={() => handleUpdate('email')}>Actualizar Email</button>
        </div>
        <div className="new-password">
          <h3>Contraseña</h3>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
          <button onClick={() => handleUpdate('password')}>Actualizar Password</button>
        </div>
      </div>

      <button className="delete-account-btn" onClick={handleDeleteAccount}>
        Eliminar Cuenta
      </button>

      {message && <p>{message}</p>}
    </section>
  );
};

export { Config };
