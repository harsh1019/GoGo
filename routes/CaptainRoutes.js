import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import { registerCaptain,loginCaptain,getCaptainProfile,logoutCaptain } from '../controllers/CaptainController.js';
import { authCaptain } from '../middlewares/authMiddleware.js';

//register
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],registerCaptain);

//login
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],loginCaptain);

//get profile
router.get('/profile',authCaptain,getCaptainProfile)

//logout
router.get('/logout',authCaptain,logoutCaptain)

export default router;