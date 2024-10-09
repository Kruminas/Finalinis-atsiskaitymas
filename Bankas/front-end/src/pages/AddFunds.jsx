import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AddFunds() {
  const { id } = useParams(); // Get account ID from URL
  const [account, setAccount] = useState(null); // Account details state
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  // Fetch account details by ID
  const fetchAccountDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/accounts/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch account details: ${response.status}`);
      }
      const data = await response.json();
      setAccount(data);
    } catch (error) {
      console.error('Error fetching account details:', error);
      alert('Error fetching account details. Please check the console for more information.');
    }
  };

  // Handle adding funds
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
        navigate('/AccountList'); // Redirect to /AccountList
      }
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  // Fetch account details when the component mounts
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
