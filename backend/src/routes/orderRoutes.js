import express from 'express';
import { getOrders, getOrderById, cancelOrder, placeOrderStripe,stripeWebhook, placeOrderKhalti, verifyKhaltiPayment } from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/getOrders',authMiddleware, getOrders);
router.get('/getOrderById/:id',authMiddleware, getOrderById);
router.delete('/cancelOrder/:id',authMiddleware, cancelOrder);
router.post('/placeOrderStripe',authMiddleware,placeOrderStripe);
router.post('/placeOrderKhalti',authMiddleware,placeOrderKhalti); 
router.post('/verifyKhaltiPayment',authMiddleware,verifyKhaltiPayment); 
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);
export default router;