const express = require('express');
const router = express.Router();
const {
  register,
  registerValidation,
  verifyEmail,
  login,
  loginValidation,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidation, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
