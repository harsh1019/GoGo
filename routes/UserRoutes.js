import express from 'express';
import { body } from 'express-validator';
import { registerUser,loginUser,getUserProfile,logoutUser } from '../controllers/userController.js';
import { authUser } from '../middlewares/authMiddleware.js';


const router = express.Router();

//Register User
router.post('/register',[
    body('fullname.firstname').isLength({min:3}).withMessage('First Name must be atleast 3 characters long'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long')
] ,registerUser);

//Login User
router.post('/login',[
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long')
] ,loginUser);


// get user profile
router.get('/profile', authUser,getUserProfile)


//logout
router.get('/logout', authUser,logoutUser)

export default router;