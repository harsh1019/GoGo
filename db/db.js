import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('✅ Database connected');
    }).catch((err) => {
        console.log('❌ Database connection error', err);
    });
}

export default connectDB;