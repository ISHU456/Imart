import express from 'express'
import authUser from '../middlewares/authUser.js';
import { upload } from '../configs/multer.js';
import { isAuth, login, register, logout, updateProfile, uploadProfilePicture } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/is-auth',authUser,isAuth);
userRouter.get('/logout',authUser,logout);
userRouter.put('/update-profile', authUser, updateProfile);
userRouter.post('/upload-profile-pic', authUser, upload.single('profilePicture'), uploadProfilePicture);

export default userRouter;