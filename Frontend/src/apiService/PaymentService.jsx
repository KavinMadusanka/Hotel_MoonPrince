import axios from "axios";

const BASE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const getResercevationDetails = async (userId) => {
    return axios.get(`${BASE_URL}${API_VERSION}/reservations/api/v1/reservations/user/${userId}`);
}

export const getAllReservations = async () => {
    return axios.get(`${BASE_URL}${API_VERSION}/reservations/api/v1/reservations/`);
}

export const getBillDetails = async (userId, roomId) => {
    return axios.get(`${BASE_URL}${API_VERSION}/payment/billing/get-billing/${userId}/${roomId}`,
        {
            withCredentials: true,
        }
    );
}