import express from 'express';
const router = express.Router();
import { query } from 'express-validator';

import { getCoordinates,GetAutoCompleteSuggestions, GetDistanceTime } from '../controllers/MapsController.js';


//get Coordinates
router.get('/get-coordinates',[
    query('address').isString().isLength({min:3})
],getCoordinates)

//get-distance-time
router.get('/get-distance-time',[
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3})
],GetDistanceTime)

//get-suggestion
router.get('/get-suggestions',[
    query('input').isString().isLength({min:3})
],GetAutoCompleteSuggestions)

export default router;