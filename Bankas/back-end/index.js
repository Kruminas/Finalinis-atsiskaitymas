import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = 'mongodb://localhost:27017/Bank';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const accountSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  accountNumber: String,
  personalCode: {
    type: String,
    required: true,
    unique: true,
  },
  passportCopy: {
    data: Buffer,
    contentType: String,
  },
  balance: { 
    type: Number, 
    default: 0
  }
});

const Account = mongoose.model('Account', accountSchema);

const validatePersonalCode = (personalCode) => {
  const regex = /^\d{11}$/;
  return regex.test(personalCode);
};

app.post('/api/accounts/:id/add-funds', async (req, res) => {
  const { amount } = req.body;
  
  if (amount <= 0) {
    return res.status(400).json({ message: 'Pridėjimo suma turi būti teigiama.' });
  }

  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Paskyra nerasta.' });
    }

    account.balance += amount;
    await account.save();

    res.status(200).json({ message: 'Lėšos sėkmingai pridėtos', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Klaida pridėdant lėšas.', error });
  }
});

app.post('/api/accounts/:id/withdraw-funds', async (req, res) => {
  const { amount } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: 'Nuskaitymo suma turi būti teigiama.' });
  }

  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Paskyra nerasta.' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ message: 'Nepakanka lėšų.' });
    }

    account.balance -= amount;
    await account.save();

    res.status(200).json({ message: 'Lėšos sėkmingai nuskaitytos', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Klaida nuskaitymo metu.', error });
  }
});
app.post('/api/accounts', upload.single('passportCopy'), async (req, res) => {
  const { firstName, lastName, accountNumber, personalCode } = req.body;

  // Validate personal code
  if (!validatePersonalCode(personalCode)) {
    return res.status(400).json({ message: 'Asmens kodas turi būti 11 skaitmenų ilgio.' });
  }

  try {
    const newAccount = new Account({
      firstName,
      lastName,
      accountNumber,
      personalCode,
      passportCopy: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newAccount.save();
    res.status(201).json({ message: 'Sąskaita sėkmingai sukurta.' });
  } catch (error) {
    // Handle unique constraint error for personalCode
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sąskaita su tokiu asmens kodu jau egzistuoja.' });
    }
    res.status(500).json({ message: 'Klaida kuriant sąskaitą.', error });
  }
});


app.get('/api/accounts', async (req, res) => {
  try {
    // Fetch and sort accounts by last name
    const accounts = await Account.find().sort({ lastName: 1 }); // Sort by lastName in ascending order
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
});

app.get('/api/accounts/:id', async (req, res) => {
  try {
      const account = await Account.findById(req.params.id);
      if (!account) {
          return res.status(404).json({ message: 'Account not found' });
      }
      res.status(200).json(account);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching account details', error });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    // Check if balance is greater than 0
    if (account.balance > 0) {
      return res.status(400).json({ message: 'Negalite ištrinti sąskaitos, nes balansas yra didesnis nei 0 EUR.' });
    }
    
    await Account.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

