import express from 'express';
import { signup, login,verifyotp,resetPassword, getCurrentUser, logout } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/verifyotp', verifyotp);
router.post('/login', login);
router.get('/logout', authMiddleware,logout);
router.post('/resetpassword', authMiddleware, resetPassword);
router.get('/getcurrentuser', authMiddleware, getCurrentUser);
  
export default router;