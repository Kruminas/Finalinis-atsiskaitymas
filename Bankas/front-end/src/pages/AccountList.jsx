import React, { useEffect, useState } from 'react';

function AccountList() {
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/accounts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched Accounts:', data);
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <h1>Sąskaitų sąrašas</h1>
      {accounts.length > 0 ? (
        <ul>
          {accounts.map((account) => (
            <li key={account._id} style={{ marginBottom: '20px' }}>
              <div style={{ justifyContent: 'center', textAlign: 'left' }}>
                Vardas ir pavardė: {account.firstName} {account.lastName}, &nbsp;
                Sąskaitos numeris: {account.accountNumber}, &nbsp;
                Asmens kodas: {account.personalCode}, &nbsp;
                Balansas: {account.balance.toFixed(2)} EUR
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
}

export default AccountList;
