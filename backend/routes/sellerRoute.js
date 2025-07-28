import express from 'express'
import { isSellerAuth, sellerLogin, sellerLogout, getSellerProfile, updateSellerProfile } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login',sellerLogin);
sellerRouter.get('/is-auth',authSeller,isSellerAuth);
sellerRouter.get('/logout',authSeller,sellerLogout);
sellerRouter.get('/profile',authSeller,getSellerProfile);
sellerRouter.put('/profile',authSeller,updateSellerProfile);

export default sellerRouter;