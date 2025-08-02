const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../utils/mailer');

const codes = new Map(); // Temporary store for email-verification code mapping

exports.sendCode = async (req, res) => {
  const { name, email, password } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(email, { name, password, code });

  try {
    await sendVerificationEmail(email, code);
    res.status(200).json({ success: true, message: 'Verification code sent to email' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const JWT_SECRET = process.env.JWT_SECRET; // Use env for production

exports.verifyCode = async (req, res) => {
  const { name, email, password, code } = req.body;
  const stored = codes.get(email);

  if (!stored || stored.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'DB Error' });

        codes.delete(email);

        // Generate JWT token
        const token = jwt.sign(
          { userId: result.insertId, email, name },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
};
