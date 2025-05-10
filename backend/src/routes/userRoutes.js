import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js'
import { getCurrentUser, updateUserProfile,getBooksByUser,addReview,getBookPdf} from '../controllers/userController.js';

const router = express.Router();

router.get('/getcurrentuser', authMiddleware, getCurrentUser);
router.put("/updateprofile",authMiddleware,upload.single("profilepic"),updateUserProfile);
router.get("/getbooksbyuser",authMiddleware,getBooksByUser);
router.post("/books/:bookId/review",authMiddleware,addReview);
router.get("/getbookpdf/:bookId",authMiddleware,getBookPdf);

export default router;
