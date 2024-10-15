import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AccountList() {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/accounts');
      if (!response.ok) {
        throw new Error('Nepavyko gauti paskyrų');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error('Klaida gaunant paskyras:', error);
      alert('Klaida gaunant paskyras. Norėdami gauti daugiau informacijos, patikrinkite konsolę.');
    }
  };

  const handleDeleteAccount = async (id) => {
    const confirmDelete = window.confirm('Ar tikrai norite ištrinti šią sąskaitą?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Sąskaita sėkmingai ištrinta.');
          fetchAccounts();
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Klaida ištrinant paskyrą:', error);
      }
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Sąskaitų sąrašas</h1>
      <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '110%' }}>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Sąskaitos numeris</th>
            <th>Asmens kodas</th>
            <th>Balansas</th>
            <th style={{position: 'relative', right: '40px'}}>Veiksmai</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account._id} style={{ textAlign: 'center' }}>
              <td>{account.firstName}</td>
              <td>{account.lastName}</td>
              <td>{account.accountNumber}</td>
              <td>{account.personalCode}</td>
              <td>{account.balance.toFixed(2)} € </td>
              <td>
                <Link to={`/accounts/${account._id}/add-funds`}>
                  <button className='PridetiLesas'>Pridėti lėšas</button>
                </Link>
                <Link to={`/accounts/${account._id}/withdraw-funds`}>
                  <button>Nuskaityti lėšas</button>
                </Link>
                <button onClick={() => handleDeleteAccount(account._id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                  Ištrinti
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountList;
