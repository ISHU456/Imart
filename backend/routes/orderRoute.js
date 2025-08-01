import express from 'express'
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, updateOrderStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD);
orderRouter.get('/user',authUser,getUserOrders);
orderRouter.get('/seller',authSeller,getAllOrders);
orderRouter.patch('/status/:orderId', authSeller, updateOrderStatus);


export default orderRouter;


