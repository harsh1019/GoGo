import express from 'express';
import { body ,query} from 'express-validator';
import { createRide,getFare,confirmRide,startRide,endRide } from '../controllers/RideController.js';

const router = express.Router();

//create a Ride
router.post('/create',[
    body('pickup').isString().isLength({min:3}).withMessage('Invalid Pickup location'),
    body('destination').isString().isLength({min:3}).withMessage('invalid Destination location'),
    body('vehicleType').isString().isIn(['auto','car','moto']).withMessage('Invalid vehicle type'),
],createRide)

//get fare
router.get('/get-fare',[
    query('pickup').isString().isLength({min:3}).withMessage('Invalid Pickup location'),
    query('destination').isString().isLength({min:3}).withMessage('invalid Destination location'),
],getFare)


//confirm
router.post('/confirm',[
    body('rideId').isMongoId().withMessage('Invalid Ride Id'),
],confirmRide)


//start ride
router.get('/start-ride',[
    query('rideId').isMongoId().withMessage('Invalid Ride Id'),
    query('otp').isString().isLength({min:6, max:6}).withMessage('Invalid OTP'),
],startRide)

//end ride
router.post('/end-ride',[
    body('rideid').isMongoId().withMessage('Invalid Ride Id'),
],endRide)

export default router;