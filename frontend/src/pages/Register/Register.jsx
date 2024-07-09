import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();

    const validate = (name, value) => {
        switch (name) {
            case 'name':
                return value ? "" : "El nombre no puede estar vacío";
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
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setErrors({ ...errors, [name]: validate(name, value) });
    }

    const handleRegister = (e) => {
        e.preventDefault();
        const isValid = Object.values(errors).every(error => error === "") && Object.values(userData).every(field => field !== "");
        if (isValid) {
            axios.post("http://localhost:3000/users/register", userData)
                .then((res) => {
                    console.log(res);
                    navigate('/access');
                })
                .catch((error) => {
                    console.log(error);
                    setGeneralError(error.response.data.message || "Error al registrar usuario");
                });
        } else {
            setGeneralError("Por favor, corrija los errores en el formulario");
        }
    }

    return (
        <form>
            <h2>Registrarse</h2>
            <label htmlFor="register-name">Nombre</label>
            <input type="text" id="register-name" name="name" value={userData.name} onChange={handleChange} required />
            {errors.name && <p>{errors.name}</p>}
            
            <label htmlFor="register-username">Username</label>
            <input type="text" id="register-username" name="username" value={userData.username} onChange={handleChange} required />
            {errors.username && <p>{errors.username}</p>}
            
            <label htmlFor="register-email">Correo Electrónico</label>
            <input type="email" id="register-email" name="email" value={userData.email} onChange={handleChange} required />
            {errors.email && <p>{errors.email}</p>}
            
            <label htmlFor="register-password">Contraseña</label>
            <input type="password" id="register-password" name="password" value={userData.password} onChange={handleChange} required />
            {errors.password && <p>{errors.password}</p>}
            
            <button type="submit" onClick={handleRegister}>Registrarse</button>
            {generalError && <p>{generalError}</p>}
        </form>
    )
}

export { Register };
