import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
        <h1>Virtualus bankas</h1>
      <nav style={{listStyleType: 'none',  display: 'flex', margin: '0', gap: '35px', justifyContent: 'center'}}>
        {/* <li>
        <Link to="/">Pagrindinis puslapis</Link>
        </li> */}
          <li>
            <Link to="/AccountList">Sąskaitų sąrašas</Link>
          </li>
          <li>
          <Link to="/AddFunds">Pridėti lėšas</Link>
          </li>
          <li>
            <Link to="/WithdrawFunds">Nuskaičiuoti lėšas</Link>
          </li>
          <li>
            <Link to="/AddAccount">Sąskaitos sukūrimas</Link>
          </li>
      </nav>
    </header>
  );
}

export default Header;
