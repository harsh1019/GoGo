import user from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import BlackListTokenModel from "../models/BlackListTokenModel.js";
import captain from "../models/CaptainModel.js";


export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const isBlackListed = await BlackListTokenModel.findOne({token: token});
    if(isBlackListed){
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userFind = await user.findById(decoded._id);
        if (!userFind) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        req.user = userFind;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
}


export const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const isBlackListed = await BlackListTokenModel.findOne({token: token});
    if(isBlackListed){
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captainFind = await captain.findById(decoded._id);
        if (!captainFind) {
            return res.status(404).json({ message: 'No captain found with this id' });
        }
        req.captain = captainFind;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
    }
}

