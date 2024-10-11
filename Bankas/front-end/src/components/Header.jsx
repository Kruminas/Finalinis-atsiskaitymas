import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
  const location = useLocation();

  return (
    <nav>
      <ul>
        {isLoggedIn && location.pathname !== '/' && (
          <>
          <div style={{display: 'flex', gap: '35px', justifyContent: 'center'}}>
            <li>
              <Link to="/AccountList">Sąskaitų sąrašas</Link>
            </li>
            <li>
              <Link to="/AddAccount">Sąskaitos sukūrimas</Link>
            </li>
            <li style={{color: 'red', position: 'relative', left: '260px'}}>
            <Link style={{color: 'red'}} to="/">Log Out</Link>
            </li>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
