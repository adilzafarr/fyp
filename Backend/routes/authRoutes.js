import express from 'express';
import * as auth from '../controllers/authController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.post('/verify-otp', auth.verifyOTP);
router.post('/verify-otp-reset', auth.verifyOTPReset);
router.post('/reset-password', auth.resetPassword);
router.post('/test-email', auth.testEmail); // Test endpoint for debugging
router.post('/get-name', authenticateToken, auth.getName);
router.get('/validate-token', authenticateToken, auth.validateToken);
router.post('/delete-account', authenticateToken, auth.deleteAccount);
router.post('/change-password', authenticateToken, auth.changePassword);

export default router;
