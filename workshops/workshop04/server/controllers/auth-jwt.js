const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'utn-api-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  });
};

const registerUser = async (req, res) => {
  const { name, lastName, email, password } = req.body || {};

  if (!name || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Name, LastName, Email and Password are required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, lastName, email, password: passwordHash });
    const created = await user.save();

    return res.status(201).json({
      id: created._id,
      name: created.name,
      lastName: created.lastName,
      email: created.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

const generateToken = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    const ok = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // main difference with token based auth is that we are using a secret key to sign the token
    // and the a payload is stored with the token
    const payload = { userId: user._id, email: user.email };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error generating token' });
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  registerUser,
};
