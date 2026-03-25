import billing from "../models/billingModel.js";

//create new billing
export const createBilling = async (req, res) => {
    try {
      console.log("first")
        const { userId, roomId, billingItems } = req.body;
        const newBilling = new billing({
            userId,
            roomId,
            billingItems
        });
        await newBilling.save();

        res.status(201).json({
            success: true,
            message: "Billing created successfully",
            data: newBilling
        });

        await newBilling.save();

        res.status(201).json({
            success: true,
            message: "Billing created successfully"
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
    const { billingId, itemId } = req.params;

    const updatedBilling = await billing.findByIdAndUpdate(
      billingId,
      {
        $pull: {
          billingItems: { _id: itemId }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: updatedBilling
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item"
    });
  }
};

//add new billing item
export const addBillingItem = async (req, res) => {
  try {
    const { billingId } = req.params;
    const item = req.body;
    console.log("Item to add:", item);

    const updatedBilling = await billing.findByIdAndUpdate(
      billingId,
      {
        $push: { billingItems: item }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedBilling
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item"
    });
  }
};

//get billing details
export const getBillingDetails = async (req, res) => {
    try {
        const { userId, roomId } = req.params;
        const billingDetails = await billing.findOne({ userId, roomId , status: "pending"});
        if (!billingDetails) {
            return res.status(404).json({
                success: false,
                message: "Billing details not found"
            });
        }
        res.status(200).json({
            success: true,
            data: billingDetails
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        });
    }
};

//get bill details for user
export const getUserBill = async (req, res) => {
  try {
    const userId  = req.user.id;
    const bills = await billing.find({ userId, status: "pending" });
    res.status(200).json({
      success: true,
      data: bills
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Side Error"
    });
  }
}