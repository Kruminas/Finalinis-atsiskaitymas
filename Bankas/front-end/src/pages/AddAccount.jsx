import React, { useState } from 'react';

function AddAccount() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    accountNumber: '',
    personalCode: '',
    passportCopy: '',
  });

  const [fileInput, setFileInput] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        passportCopy: files[0],
      });
      setFileInput(files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const generateAccountNumber = () => {
    const randomDigits = Math.floor(100000000000000000 + Math.random() * 900000000000000000).toString();
    const formattedAccountNumber = `LT${randomDigits}`.replace(/(.{4})/g, '$1 ').trim();
    setFormData({ ...formData, accountNumber: formattedAccountNumber });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountData = new FormData();
    accountData.append('firstName', formData.firstName);
    accountData.append('lastName', formData.lastName);
    accountData.append('accountNumber', formData.accountNumber);
    accountData.append('personalCode', formData.personalCode);
    accountData.append('passportCopy', formData.passportCopy);

    try {
      const response = await fetch('http://localhost:3000/api/accounts', {
        method: 'POST',
        body: accountData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        
        setFormData({
          firstName: '',
          lastName: '',
          accountNumber: '',
          personalCode: '',
          passportCopy: '',
        });
        setFileInput(null);

        setFormKey(prevKey => prevKey + 1);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Klaida:', error);
      alert('Išsaugant paskyros duomenis įvyko klaida');
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Sąskaitos sukūrimas</h1>
      <form key={formKey} onSubmit={handleSubmit}>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          <label style={{ display: 'block', marginBottom: '10px', marginRight: '10px' }}>
            Vardas:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ display: 'block', marginBottom: '10px', marginRight: '10px' }}>
            Pavardė:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ display: 'block', marginBottom: '10px', marginRight: '10px' }}>
            Sąskaitos numeris:
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="button" onClick={generateAccountNumber} style={{ marginLeft: '10px', padding: '8px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}>Generate</button>
            </div>
          </label>

          <label style={{ display: 'block', marginBottom: '10px', marginRight: '10px' }}>
            Asmens kodas:
            <input type="text" name="personalCode" value={formData.personalCode} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <label style={{ display: 'block', marginBottom: '10px', marginRight: '10px' }}>
            Paso kopijos nuotrauka:
            <input type="file" name="passportCopy" accept="image/*" onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </label>

          <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>Sukurti sąskaitą</button>
        </div>
      </form>
    </div>
  );
}

export default AddAccount;