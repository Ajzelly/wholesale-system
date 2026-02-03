const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Register user
exports.register = (req, res) => {
  const { username, email, password, phone } = req.body;

  console.log('📝 Registration attempt:', { username, email, phone });

  // Validation
  if (!username || !email || !password) {
    console.log('❌ Registration failed: Missing fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      console.log('❌ Registration failed: Email already exists -', email);
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users SET ?', { name: username, email, password: hashedPassword, phone: phone || null, role: 'customer' }, (err) => {
      if (err) {
        console.log('❌ Registration failed:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ User registered successfully:', { username, email });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login user
exports.login = (req, res) => {
  const { username, password } = req.body;

  console.log('🔐 Login attempt:', { username });

  if (!username || !password) {
    console.log('❌ Login failed: Missing credentials');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.query('SELECT * FROM users WHERE name = ?', [username], async (err, results) => {
    if (err) {
      console.log('❌ Database error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      console.log('❌ Login failed: User not found -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful:', { username, email: user.email });
    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};
