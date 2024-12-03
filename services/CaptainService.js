import captain from "../models/CaptainModel.js"

export const createCaptain = async ({
    fullname,email,password,vehicle
}) => {

    if(!fullname.firstname||!fullname.lastname || !email || !password || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType){
        throw new Error('All fields are required')
    }

    const Newcaptain = new captain({
        fullname: fullname,
        email,
        password,
        vehicle:vehicle
    })

    await Newcaptain.save()
    return Newcaptain
}