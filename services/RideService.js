import ride from "../models/RideModel.js"
import bcrypt from 'bcrypt'
import { getDistanceTime } from "./MapsService.js"
import crypto from 'crypto'

export const GetFare = async (pickup,destination) => {
  if(!pickup||!destination){
    throw new Error('All fields are required')
  }

  const distanceTime = await getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;
}


function getOtp(num){
    function generateOtp(num){
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }

    return generateOtp(num);
}


export const CreateRide = async ({
    user,pickup,destination,vehicleType
}) => {
    if(!user||!pickup||!destination||!vehicleType){
        throw new Error('All fields are required')
    }

    const fare = await GetFare(pickup,destination);

    const otp = getOtp(6);

    const NewRide = new ride({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        otp
    })

    await NewRide.save()
    return NewRide
}

export const ConfirmRide = async ({rideId ,captain}) => {
    if(!rideId){
        throw new Error('All fields are required')
    }

    await ride.findByIdAndUpdate({
        _id: rideId
    },{
        captain: captain._id,
        status: 'accepted'
    })


    const rideData = await ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if(!rideData){
        throw new Error('Ride not found')
    }

    return rideData
}


export const StartRide = async ({rideId,otp,captain}) => {

    if(!rideId||!otp){
        throw new Error('Ride Id and OTP are required')
    }

    const rideData = await ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if(!rideData){
        throw new Error('Ride not found')
    }

    if(rideData.status !== 'accepted'){
        throw new Error('Ride Not Accepted')
    }

    await ride.findByIdAndUpdate({
        _id: rideId
    },{
        status: 'ongoing'
    })

    return rideData
}

export const EndRide = async ({rideId,captain}) => {
    if(!rideId){
        throw new Error('Ride Id is required')
    }

    const rideData = await ride.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if(!rideData){
        throw new Error('Ride not found')
    }

    if(rideData.status !== 'ongoing'){
        throw new Error('Ride Not Ongoing')
    }

    await ride.findByIdAndUpdate({
        _id: rideId
    },{
        status: 'completed',
    })

    return rideData
}