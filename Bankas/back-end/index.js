import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Bank';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

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
    default: 0,
  },
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
    res.status(500).json({ message: 'Klaida pridėdant lėšas.', error: error.message });
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
    res.status(500).json({ message: 'Klaida nuskaitymo metu.', error: error.message });
  }
});

app.post('/api/accounts', upload.single('passportCopy'), async (req, res) => {
  const { firstName, lastName, accountNumber, personalCode } = req.body;

  if (personalCode && !validatePersonalCode(personalCode)) {
    return res.status(400).json({ message: 'Asmens kodas turi būti 11 skaitmenų ilgio.' });
  }

  try {
    const newAccount = new Account({
      firstName,
      lastName,
      accountNumber,
      personalCode: personalCode || null,
      passportCopy: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newAccount.save();
    res.status(201).json({ message: 'Sąskaita sėkmingai sukurta.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sąskaita su tokiu asmens kodu jau egzistuoja.' });
    }
    res.status(500).json({ message: 'Klaida kuriant sąskaitą.', error });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Reikalingas vartotojo vardas ir slaptažodis.' });
  }

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Vartotojo vardas jau egzistuoja.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          username,
          password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'Vartotojo paskyra sėkmingai sukurta.' });
  } catch (error) {
      console.error('Klaida registruojantis:', error);
      res.status(500).json({ message: 'Serverio klaida registruojantis.', error });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Reikalingas vartotojo vardas ir slaptažodis.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Neteisingas vartotojo vardas arba slaptažodis.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Neteisingas vartotojo vardas arba slaptažodis.' });
    }

    res.status(200).json({ message: 'Prisijungimas sėkmingas!', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Serverio klaida prisijungiant.', error });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await Account.find().sort({ lastName: 1 });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Klaida gaunant paskyras', error });
  }
});

app.get('/api/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Paskyra nerasta' });
    }
    res.status(200).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Klaida gaunant išsamią paskyros informaciją', error });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Paskyra nerasta' });
    }
    
    if (account.balance > 0) {
      return res.status(400).json({ message: 'Negalite ištrinti sąskaitos, nes balansas yra didesnis nei 0 EUR.' });
    }
    
    await Account.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Paskyra sėkmingai ištrinta' });
  } catch (error) {
    res.status(500).json({ message: 'Klaida ištrinant paskyrą', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
