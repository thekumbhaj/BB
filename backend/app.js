const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bugRoutes = require('./routes/bugRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());

// CSRF protection: for cookie-based requests, verify Origin/Referer matches the allowed frontend.
// SameSite=strict is the primary CSRF defence; this header check is an additional layer.
app.use((req, res, next) => {
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!mutatingMethods.includes(req.method)) return next();

  // Skip if no cookies are used (pure Bearer token auth has no CSRF risk)
  if (!req.cookies || !req.cookies.token) return next();

  const origin = req.headers.origin || req.headers.referer;
  const allowed = process.env.FRONTEND_URL || 'http://localhost:3000';

  // If no Origin/Referer header is present, the SameSite=strict cookie attribute
  // provides the primary CSRF protection, so we allow the request through.
  if (origin && !origin.startsWith(allowed)) {
    return res.status(403).json({ message: 'Forbidden: invalid request origin' });
  }
  next();
});

// Rate limiters
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/bugs', defaultLimiter, bugRoutes);
app.use('/api/support', defaultLimiter, supportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
});

module.exports = app;
