import express from 'express';
import { getAdmin, login, logout,addBook,getBooks,updateBook,deleteBook,getUsers,updateUser,deleteUser,getAllOrders,updateOrderStatus,deleteOrder} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout',logout);

router.get("/getAdmin",authMiddleware,getAdmin)

router.get("/getbooks", authMiddleware,getBooks);
router.post("/addbook", authMiddleware,addBook);
router.put("updatebook/:id",authMiddleware, updateBook);
router.delete("deletebook/:id",authMiddleware, deleteBook);


router.get("/getusers", getUsers);
router.put("updateuser/:id", updateUser);
router.delete("deleteuser/:id", deleteUser);

router.get("/getallorders", authMiddleware,getAllOrders);
router.put("/updateorderstatus/:id", authMiddleware,updateOrderStatus);
router.delete("/deleteorder/:id", authMiddleware,deleteOrder);

export default router;