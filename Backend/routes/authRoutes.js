const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.post('/get-name', authenticateToken, auth.getName);
router.get('/validate-token', authenticateToken, auth.validateToken);
router.post('/delete-account', authenticateToken, auth.deleteAccount);
router.post('/change-password', authenticateToken, auth.changePassword);

module.exports = router;
