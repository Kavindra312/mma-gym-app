const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// In-memory user store (replace with database later)
const users = new Map();
const refreshTokens = new Map();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
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
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt,
});

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;

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

    if (users.has(email.toLowerCase())) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const validRoles = ['student', 'coach', 'head_coach'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      role,
      createdAt: new Date().toISOString(),
    };

    users.set(user.email, user);

    const tokens = generateTokens(user);
    refreshTokens.set(tokens.refreshToken, user.id);

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

    const user = users.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = generateTokens(user);
    refreshTokens.set(tokens.refreshToken, user.id);

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

    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (err) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const userId = refreshTokens.get(refreshToken);
    let user = null;
    for (const u of users.values()) {
      if (u.id === userId) {
        user = u;
        break;
      }
    }

    if (!user) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({ error: 'User not found' });
    }

    // Revoke old refresh token
    refreshTokens.delete(refreshToken);

    // Generate new tokens
    const tokens = generateTokens(user);
    refreshTokens.set(tokens.refreshToken, user.id);

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
      refreshTokens.delete(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export users map for middleware access
const getUsers = () => users;

module.exports = {
  register,
  login,
  refresh,
  me,
  logout,
  getUsers,
};
