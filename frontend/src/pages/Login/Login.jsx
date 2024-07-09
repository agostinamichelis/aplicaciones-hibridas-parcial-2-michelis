import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/users/login", userData)
            .then((res) => {
                setUser(res.data.usuario);
                Cookies.set('jwToken', res.data.jwToken, { expires: 1 });
                navigate('/recipes');
            })
            .catch((error) => {
                setError(error.response.data.error);
            });
    };

    return (
        <form>
            <h2>Iniciar Sesión</h2>
            <label htmlFor="login-email">Correo Electrónico</label>
            <input type="email" id="login-email" name="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} required />
            <label htmlFor="login-password">Contraseña</label>
            <input type="password" id="login-password" name="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} required />
            <button type="submit" onClick={handleLogin}>Iniciar Sesión</button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export {Login};
