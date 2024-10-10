import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddFunds() {
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

  const handleAddFunds = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${id}/add-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert('Lėšos sėkmingai pridėtos.');
        navigate('/AccountList');
      }
    } catch (error) {
      console.error('Klaida pridedant lėšų:', error);
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
      <h1>Pridėti lėšas</h1>
      <div>
        <p>
          <strong>Savininko vardas:</strong> {account.firstName}
        </p>
        <p>
          <strong>Savininko pavardė:</strong> {account.lastName}
        </p>
        <p>
          <strong>Sąskaitos likutis:</strong> {account.balance.toFixed(2)} EUR
        </p>
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
      <button onClick={handleAddFunds} style={{ marginTop: '10px' }}>
        Pridėti lėšas
      </button>
    </div>
  );
}

export default AddFunds;
