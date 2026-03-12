import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: null
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    role:{
        type: Number,
        default: 0,
        enum: [0,1,2] //user - 0, receptionist -1, admin - 2
    },
    resetOtpHash: {
        type: String
    },
    resetOtpExpires:{
        type: Date
    }
}, { timestamps: true })

export default mongoose.model("user", userSchema);