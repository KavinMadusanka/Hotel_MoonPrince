import mongoose from "mongoose";
import colors from 'colors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connect To MongoDB ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in mongoDB ${error}`.bgRed.white)
    }
}

export default connectDB;