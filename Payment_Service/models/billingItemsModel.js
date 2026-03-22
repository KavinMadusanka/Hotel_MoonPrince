import mongoose from "mongoose";

export const billingItemsSchema = new mongoose.Schema({
    ItemType: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    UnitPrice: {
        type: Number,
        required: true,
    }

}, { timestamps: true });

export default mongoose.model('billingItems', billingItemsSchema);