import user from "../models/UserModel.js";

export const createUser = async ({
    fullname,email,password
}) => {

    if(!fullname.firstname||!fullname.lastname || !email || !password){
        throw new Error('All fields are required')
    }

    const users = new user({
        fullname: fullname,
        email,
        password
    })

    await users.save()
    return users
}