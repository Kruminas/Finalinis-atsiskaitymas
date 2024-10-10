import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AddFunds from './pages/AddFunds.jsx';
import WithdrawFunds from './pages/WithdrawFunds.jsx';
import AddAccount from './pages/AddAccount.jsx';
import AccountList from './pages/AccountList';
import LoginPage from './pages/LoginPage';
import './App.css';
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        {isLoggedIn && (
          <>
            <Route path="/AccountList" element={<AccountList />} />
            <Route path="/accounts/:id/add-funds" element={<AddFunds />} />
            <Route path="/accounts/:id/withdraw-funds" element={<WithdrawFunds />} />
            <Route path="/AddAccount" element={<AddAccount />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
