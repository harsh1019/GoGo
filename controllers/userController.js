import { validationResult } from "express-validator"
import user from "../models/UserModel.js"
import { createUser } from "../services/UserService.js"
import BlackListTokenModel from "../models/BlackListTokenModel.js"


export const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const {fullname,email,password} = req.body
    const isUserAlready = await user.findOne({email})

    if(isUserAlready){
        return res.status(400).json({message: 'User already exists'})
    }

    const hashedPassword = await user.hashPassword(password)

    const newUser = await createUser({
        fullname,
        email,
        password: hashedPassword
    })

    const token = newUser.generateAuthToken()
    res.status(201).json({token,newUser})
}


export const loginUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {email,password} = req.body;
    const userFind = await user.findOne({email}).select('+password');

    if(!userFind){
        return res.status(400).json({message: 'Invalid credentials'})
    }

    const isMatch = await userFind.comparePassword(password);
    if(!isMatch){
        return res.status(400).json({message: 'Invalid credentials'})
    }
    
    const token = userFind.generateAuthToken()
    res.cookie('token', token)
    res.status(200).json({token,userFind})
}

export const getUserProfile = async (req, res) => {
    res.status(200).json(req.user)
}

export const logoutUser = async (req, res) => {
    res.clearCookie('token')
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await BlackListTokenModel.create({token});
    res.status(200).json({message: 'Logged out successfully'})
}