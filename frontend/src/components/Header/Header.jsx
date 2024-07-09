import React, { useContext } from 'react';
import './Header.module.scss';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header>
      <div>
        <h1>!Bienvenid@<span>{user ? ', ' + user.username + '!' : '!'}</span></h1>
      </div>
    </header>
  );
}

export default Header;
