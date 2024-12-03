import { validationResult } from 'express-validator'
import { CreateRide,ConfirmRide,StartRide,EndRide,GetFare } from '../services/RideService.js'
import { getAddressCoordinates, getDistanceTime, getAutoCompleteSuggestions, getCaptainsInTheRadius} from '../services/MapsService'
import { sendMessageToSocketId } from '../socket.js'
export const createRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {userId,pickup,destination,vehicleType} = req.body
    try {
        const newRide = await CreateRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        })

        res.status(201).json(newRide)
        const pickupCoordinates = await getAddressCoordinates(pickup);
        const captainInRadius = await getCaptainsInTheRadius(pickupCoordinates.latitude,pickupCoordinates.longitude,2);
        newRide.otp=""

        const rideWithUser = await ride.findOne({
            _id: newRide._id
        }).populate('user');

        captainInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId,{
                event:'new-Ride',
                data:rideWithUser
            })
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
}

export const getFare = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    const {pickup,destination} = req.query
    try {
        const Fares = await GetFare(pickup,destination)
        return res.status(200).json(Fares)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
}


export const confirmRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {rideId} = req.body
    try {
        const rides = await ConfirmRide({
            rideId,
            captain: req.captain
        })

        sendMessageToSocketId(rides.user.socketId,{
            event:'ride-confirmed',
            data:rides
        })
        return res.status(200).json(rides)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
}


export const startRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {rideId,otp} = req.query
    try {
        const Rides = await StartRide({
            rideId,
            otp,
            captain: req.captain
        })

        sendMessageToSocketId(Rides.user.socketId,{
            event:'ride-started',
            data:Rides
        })

        return res.status(200).json(Rides)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
}

export const endRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {rideid} = req.body
    try {
        const Rides = await EndRide({
            rideId: rideid,
            captain: req.captain
        })

        sendMessageToSocketId(Rides.user.socketId,{
            event:'ride-ended',
            data:Rides
        })

        return res.status(200).json(Rides)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
}
