const db = require('../models/db');
const { sendVerificationEmail } = require('../utils/mailer');

const codes = new Map(); // Temporary store for email-verification code mapping

exports.sendCode = async (req, res) => {
  const { fullName, email, password } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(email, { fullName, password, code });

  try {
    await sendVerificationEmail(email, code);
    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  const stored = codes.get(email);

  if (!stored || stored.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  const { fullName, password } = stored;

  db.query(
    'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
    [fullName, email, password],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB Error' });
      codes.delete(email);
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
};
