import axios from "axios";
import captain from "../models/CaptainModel.js";


export const getAddressCoordinates = async (address) => {
  
const apiKey = process.env.GOOGLE_API_KEY;
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
        const location = response.data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng
        };
    } else {
        throw new Error("Unable to fetch coordinates");
    }
} catch (error) {
    console.error(error);
    throw error;
}

}

export const getDistanceTime = async (origin, destination) => {
 //get distance time mateix using google maps api
 if (!origin || !destination) {
    throw new Error("Origin and destination are required");
 }

    const apiKey= process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error("Unable to fetch distance and time");
        }
    }catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export const getCaptainsInTheRadius = async (ltd,lng, radius) => {
     
    const captains = await captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371]
            }
        }
    });

    return captains;
}