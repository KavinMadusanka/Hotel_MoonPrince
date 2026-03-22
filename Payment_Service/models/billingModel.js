import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    roomId: {
        type: String,
        required: true,
        trim: true
    },
    billingItems: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true //ensure each item has unique id
        },
        ItemType: {
            type: String,
            required: true,
        },
        Description: {
            type: String,
            required: true,
        },
        QTY: {
            type: Number,
            required: true,
        },
        UnitPrice: {
            type: Number,
            required: true,
        }
    }],

    //payment Status: pending, paid
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('billing', billingSchema);