import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Įveskite vartotojo vardą ir slaptažodį.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message || 'Netinkami prisijungimo duomenys.');
      } else {
        const data = await response.json();
        console.log('Account ID:', data.accountId);
        onLogin();
        navigate('/AccountList');
      }
    } catch (error) {
      console.error('Klaida prisijungiant:', error);
      setErrorMessage('Klaida prisijungiant. Bandykite dar kartą.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '30px'}}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" style={{position: 'relative', bottom: '10px'}}>Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
