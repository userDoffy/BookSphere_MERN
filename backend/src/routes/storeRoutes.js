import express from 'express';
import { latest,getBookById,popular, searchBooks } from '../controllers/storeContoller.js';
const router = express.Router();

router.get("/latest",latest);
router.get("/popular",popular)
router.get("/book/:id",getBookById);
router.get("/search",searchBooks);
// router.get("/foryou",foryou);

export default router;