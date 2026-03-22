import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const getResercevationDetails = async (userId) => {
    return axios.get(`${BASE_URL}${API_VERSION}/reservations/api/v1/reservations/user/${userId}`);
}

export const getAllReservations = async () => {
    return axios.get(`${BASE_URL}${API_VERSION}/reservations/`);
}

export const getBillDetails = async (userId, roomId) => {
    return axios.get(`${BASE_URL}${API_VERSION}/payment/billing/get-billing/${userId}/${roomId}`,
        {
            withCredentials: true,
        }
    );
}

//add new billing item type
export const addBillingItemType = async (itemData) => {
    return axios.post(`${BASE_URL}${API_VERSION}/payment/items/create-billing`, itemData, {
        withCredentials: true,
    });
}

//get billing items
export const getBillingItems = async () => {
    return axios.get(`${BASE_URL}${API_VERSION}/payment/items/billing-items`, {
        withCredentials: true,
    });
}

//add new bill to a reservation
export const addBillToReservation = async (billingId, itemData) => {
    console.log("billing id", billingId);
    console.log("item data", itemData);
    return axios.patch(`${BASE_URL}${API_VERSION}/payment/billing/addNewItem/${billingId}`, 
        itemData, 
        {
            withCredentials: true,
    });
}

//remove item from bill
export const removeItemFromBill = async (billingId, itemId) => {
    console.log(billingId)
    console.log(itemId)
    return axios.delete(`${BASE_URL}${API_VERSION}/payment/billing/remove-item/${billingId}/${itemId}`,
        {
            withCredentials: true,
        }
    );
}
