const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  const { username, email, password, phone } = req.body;

  console.log('📝 Registration attempt:', { username, email, phone });

  if (!username || !email || !password) {
    console.log('❌ Registration failed: Missing fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      console.log('❌ Registration failed: Email already exists -', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone || null, 'customer']
    );

    console.log('✅ User registered successfully:', { username, email });
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.log('❌ Registration failed:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 Login attempt:', { username });

  if (!username || !password) {
    console.log('❌ Login failed: Missing credentials');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE name = ?', [username]);
    if (users.length === 0) {
      console.log('❌ Login failed: User not found -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful:', { username, email: user.email });
    res.status(200).json({ 
      message: 'Login successful', 
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });

  } catch (err) {
    console.log('❌ Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
