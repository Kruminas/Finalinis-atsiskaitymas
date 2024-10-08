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

app.post('/api/accounts', upload.single('passportCopy'), async (req, res) => {
  const { firstName, lastName, accountNumber, personalCode } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Failas neįkeltas' });
  }

  if (!validatePersonalCode(personalCode)) {
    return res.status(400).json({ message: 'Asmens kodas turi būti sudarytas iš 11 skaitmenų ir jame turi būti tik skaičiai.' });
  }

  try {
    const existingAccount = await Account.findOne({ personalCode });
    if (existingAccount) {
      return res.status(400).json({ message: 'Asmens kodas jau egzistuoja toks.' });
    }

    const account = new Account({
      firstName,
      lastName,
      accountNumber,
      personalCode,
      passportCopy: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await account.save();
    res.status(201).json({ message: 'Paskyra sėkmingai sukurta' });
  } catch (error) {
    res.status(500).json({ message: 'Klaida kuriant paskyrą.', error });
  }
});

app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Klaida gaunant paskyras', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
