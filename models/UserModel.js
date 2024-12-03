import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [ 5, 'Email must be at least 5 characters long' ],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function() {
 const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
     expiresIn: '30d',
 });

 return token
}

userSchema.methods.comparePassword = async function(password) {
   return await bcrypt.compare(password, this.password);
}


userSchema.statics.hashPassword = async function(password) {
 return await bcrypt.hash(password, 10);
}


const user = mongoose.model('user', userSchema);
export default user;