import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function WithdrawFunds() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${id}`);
      if (!response.ok) {
        throw new Error(`Nepavyko gauti paskyros informacijos: ${response.status}`);
      }
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error('Klaida gaunant išsamią paskyros informaciją:', error);
      alert('Klaida gaunant išsamią paskyros informaciją. Norėdami gauti daugiau informacijos, patikrinkite konsolę.');
    }
  };

  const handleWithdrawFunds = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount <= 0) {
      alert('Suma turi būti teigiama.');
      return;
    }

    if (withdrawAmount > account.balance) {
      alert('Nepakanka lėšų.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${id}/withdraw-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: withdrawAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert('Lėšos sėkmingai nuskaitytos.');
        navigate('/AccountList');
      }
    } catch (error) {
      console.error('Klaida išimant lėšas:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (account.balance >= 0.01) {
      alert('Negalite ištrinti sąskaitos, kol turite 0.01 EUR ar daugiau.');
      return;
    }

    const confirmDelete = window.confirm('Ar tikrai norite ištrinti šią sąskaitą?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/api/accounts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Sąskaita sėkmingai ištrinta.');
          navigate('/AccountList');
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
    fetchAccountDetails();
  }, []);

  if (!account) {
    return <p>Loading account details...</p>;
  }

  return (
    <div>
      <h1>Nuskaityti lėšas</h1>
      <div>
        <p><strong>Savininko vardas:</strong> {account.firstName}</p>
        <p><strong>Pavardė:</strong> {account.lastName}</p>
        <p><strong>Sąskaitos likutis:</strong> {account.balance.toFixed(2)} EUR</p>
      </div>
      <label>
        Suma:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Įveskite sumą"
        />
      </label>
      <button onClick={handleWithdrawFunds} style={{ marginTop: '10px' }}>
        Nuskaityti lėšas
      </button>
    </div>
  );
}

export default WithdrawFunds;
