import React from 'react'
import '../../App.css'
import { Login } from '../Login/Login'
import { Register } from '../Register/Register'
import { useState } from 'react'
import './Access.scss'

const Access = () => {

  const [selectedTab, setSelectedTab] = useState('login-tab');

  const handleTabChange = (event) => {
    setSelectedTab(event.target.id);
  };

  return (
    <div className="contenedor-login">
      <header className="header-login">
        <h1>Baratie Cooking & Baking</h1>
      </header>
      <main>
        <section className="section-login">
          <div className="logo-login">
            <img src="/assets/logo-home.png" alt="" />
          </div>
          <div className="tabs-container">
            <input type="radio"
              name="tab"
              id="login-tab"
              checked={selectedTab === 'login-tab'}
              onChange={handleTabChange} />
            <label htmlFor="login-tab" className="tab-link">Iniciar Sesión</label>
            <input type="radio"
              name="tab"
              id="register-tab"
              checked={selectedTab === 'register-tab'}
              onChange={handleTabChange} />
            <label htmlFor="register-tab" className="tab-link">Registrarse</label>



            <div className="tab-content" id="login">
              {selectedTab === 'login-tab' && <Login />}
            </div>
            <div className="tab-content" id="register">
              {selectedTab === 'register-tab' && <Register />}
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}

export { Access }