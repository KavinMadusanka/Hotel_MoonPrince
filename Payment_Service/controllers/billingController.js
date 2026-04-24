import billing from "../models/billingModel.js";
import axios from "axios";

//create new billing
export const createBilling = async (req, res) => {
    try {
      console.log("first")
        const { userId, roomId } = req.body;
        let roomDetails = null;
        try {
          const roomRes = await axios.get(
            `${process.env.ROOM_SERVICE_URL}/room-types/${roomId}`
          );
          roomDetails = roomRes.data?.data;
        } catch (roomError) {
          console.error("Room service call failed:", roomError.message);
        }
        const billingItems = [];
        if (roomDetails) {
          billingItems.push({
            itemName: roomDetails.name,
            itemPrice: roomDetails.basePrice,
            quantity: 1
          });
        }

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

// update billing status from pending to paid (receptionist only)
export const updateBillingStatus = async (req, res) => {
  try {
    const { billingId } = req.params;

    // find billing record first to check it exists and is still pending
    const existingBilling = await billing.findById(billingId);

    if (!existingBilling) {
      return res.status(404).json({
        success: false,
        message: "Billing record not found"
      });
    }

    if (existingBilling.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "This billing record is already marked as paid"
      });
    }

    const updatedBilling = await billing.findByIdAndUpdate(
      billingId,
      { status: "paid" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment status updated to paid successfully",
      data: updatedBilling
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Side Error"
    });
  }
};