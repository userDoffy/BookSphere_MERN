import express from 'express';
import { latest,getBookById,popular } from '../controllers/storeContoller.js';
const router = express.Router();

router.get("/latest",latest);
router.get("/popular",popular)
router.get("/book/:id",getBookById);
// router.get("/foryou",foryou);

export default router;