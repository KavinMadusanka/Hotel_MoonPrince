import ItemsModel from "../models/billingItemsModel.js";

//create new billing item
export const createBillingItem = async (req, res) => {
    try {
        const { ItemType, Description, UnitPrice } = req.body;
        
        const newBillingItem = new ItemsModel({ ItemType, Description, UnitPrice });
        await newBillingItem.save();
        
        res.status(201).json({
            success: true,
            message: "Billing item created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}

//remove billing item
export const removeBillingItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deletedItem = await ItemsModel.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Billing item not found."
            });
        }
        res.status(200).json({
            success: true,
            message: "Billing item removed successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}

//get biling items
export const getBillingItems = async (req, res) => {
    try {
        const items = await ItemsModel.find();
        res.status(200).json({
            success: true,
            data: items
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}