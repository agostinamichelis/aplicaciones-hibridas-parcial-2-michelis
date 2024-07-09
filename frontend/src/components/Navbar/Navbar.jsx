import React, { useContext } from 'react'
import './Navbar.module.scss'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'

const Navbar = () => {

  const { user, logoutUser } = useContext(AuthContext)

  return (
    <div>
      <nav>
        <div className="logo">
          <img src="/public/assets/logo-navbar.png" alt="Logo" />
        </div>
        <ul className="nav-items">
          {
            user ?
              (<>
                <li><NavLink to="/recipes">Recetas</NavLink></li>
                <li><NavLink to="/recipes/my-recipes">Perfil</NavLink></li>
                <li><NavLink onClick={() => logoutUser()} to="/">Logout</NavLink></li>
              </>)
              :
              (<>
                
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/recipes">Recetas</NavLink></li>
                <li><NavLink to="/access">Ingresar</NavLink></li>


              </>)
          }
        </ul>
      </nav>
    </div>
  )
}

export default Navbar

