import { validationResult } from "express-validator"
import { createCaptain } from "../services/CaptainService.js"
import BlackListTokenModel from "../models/BlackListTokenModel.js"
import captain from "../models/CaptainModel.js"

export const registerCaptain = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {fullname,email,password,vehicle} = req.body
    const isCaptainAlready = await captain.findOne({email})
    if(isCaptainAlready){
        return res.status(400).json({message: 'Captain already exists'})
    }

    const hashedPassword = await captain.hashPassword(password)

    const Newcaptain = await createCaptain({
        fullname,
        email,
        password: hashedPassword,
        vehicle
    })

    const token = Newcaptain.generateAuthToken()
    res.status(201).json({token,Newcaptain})
}

export const loginCaptain = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {email,password} = req.body;
    const captainFind = await captain.findOne({email}).select('+password');

    if(!captainFind){
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const isMatch = await captainFind.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials'})
    }
    
    const token = captainFind.generateAuthToken()
    res.cookie('token', token)
    res.status(200).json({token,captainFind})

}
export const getCaptainProfile = async (req, res) => {
    res.status(200).json({captain:req.captain})
}

export const logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    await BlackListTokenModel.create({token})
    res.clearCookie('token')
    res.status(200).json({message: 'Logged out successfully'})
}
