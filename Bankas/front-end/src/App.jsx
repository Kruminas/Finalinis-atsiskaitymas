import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddFunds from './pages/AddFunds.jsx';
import WithdrawFunds from './pages/WithdrawFunds.jsx';
import AddAccount from './pages/AddAccount.jsx'
import AccountList from './pages/AccountList';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/AccountList" element={<AccountList />} />
        <Route path="/AccountList" element={<Home />} />
        <Route path="/AddFunds" element={<AddFunds />} />
        <Route path="/WithdrawFunds" element={<WithdrawFunds />} />
        <Route path="AddAccount" element={<AddAccount />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
