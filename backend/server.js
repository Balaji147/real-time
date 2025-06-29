import dotenv from "dotenv"
import mongoose from 'mongoose';

const dbUrl = process.env.DB_CONNECT

const connectDB = async () => {
    try 
    {
        await mongoose.connect(dbUrl, {connectTimeoutMS: 30000});
        console.log('DB Mate Opened');
    } 
    catch (err) 
    {
        console.error('Connection Error:', err);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB