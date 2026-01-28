const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db/knex');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, tokenId: crypto.randomUUID() },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  createdAt: user.created_at,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Roles are assigned per-gym via gym_staff table, not during registration
    if (role) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if email already exists
    const existing = await db('users').where({ email: email.toLowerCase() }).first();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user into database
    const [user] = await db('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        first_name: firstName || '',
        last_name: lastName || '',
      })
      .returning('*');

    const tokens = generateTokens(user);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db('users')
      .where({ email: email.toLowerCase() })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db('users').where({ id: user.id }).update({ last_login_at: db.fn.now() });

    const tokens = generateTokens(user);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Check if token exists and is not expired
    const storedToken = await db('refresh_tokens')
      .where({ token: refreshToken })
      .where('expires_at', '>', new Date())
      .first();

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (err) {
      await db('refresh_tokens').where({ token: refreshToken }).del();
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await db('users')
      .where({ id: storedToken.user_id })
      .whereNull('deleted_at')
      .first();

    if (!user) {
      await db('refresh_tokens').where({ token: refreshToken }).del();
      return res.status(401).json({ error: 'User not found' });
    }

    // Revoke old refresh token
    await db('refresh_tokens').where({ token: refreshToken }).del();

    // Generate new tokens
    const tokens = generateTokens(user);

    // Store new refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      message: 'Token refreshed successfully',
      ...tokens,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await db('refresh_tokens').where({ token: refreshToken }).del();
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
};
