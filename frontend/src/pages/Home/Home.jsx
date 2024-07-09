import React from 'react'
import '../../App.css'
import './../../components/Navbar/Navbar.module.scss'
import './Home.scss'

const Home = () => {

  return (
    <div className="home">
      <div className="home-header">
        <img className="banner" src="sanji-banner.png" alt="" />
        <div className="header-landing">
          <div className="header-landing-column">
            <h1>¡Bienvenid@s!</h1>
            <p>Únete a nuestra tripulación culinaria, comparte tus propias creaciones y descubre nuevos sabores.</p>
          </div>
          <div className="logo-landing">
            <img src="/assets/logo-home.png" alt="Logo"/>
          </div>
        </div>
      </div>

      <main>
        <div className="pastillas-login">
          <div>
            <img src="/assets/favorites.png" alt=""/>
              <h2>Cociná tus comidas favoritas</h2>
              <p></p>
          </div>
          <div>
            <img src="/assets/new.png" alt=""/>
              <h2>Conocé nuevos sabores</h2>
              <p></p>
          </div>
          <div>
            <img src="/assets/share.png" alt=""/>
              <h2>Compartí tus recomendaciones</h2>
              <p></p>
          </div>
        </div>

        <div className="notebook">
          <h2>Ingresá y embarca en esta aventura</h2>
          <img src="/assets/login.png" alt=""/>
            <button>Ingresar</button>
        </div>
      </main>
    </div>
  )
}

export { Home }