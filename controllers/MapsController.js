import { getAddressCoordinates,getDistanceTime,getAutoCompleteSuggestions,geCaptainsInTheRadius } from "../services/MapsService.js";

export const getCoordinates = async (req, res) => {
 const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {address} = req.query;

    try {
        const coordinates = await getAddressCoordinates(address);
        res.status(200).json(coordinates);
        
    } catch (err) {
        res.status(400).json({message: 'Could not get coordinates'})
    }
}


export const GetDistanceTime = async (req, res) => {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {origin,destination} = req.query;
        const distanceTime = await getDistanceTime(origin,destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Could not get distance and time'})
    }
}

export const GetAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {input} = req.query;
        const suggestions = await getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Could not get suggestions'})
    }
}

