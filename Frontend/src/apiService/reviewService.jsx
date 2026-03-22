import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const GUEST_BASE = `${USER_SERVICE_URL}${API_VERSION}/guestService`;

export const createReview = async (payload) => {
	return axios.post(`${GUEST_BASE}/reviews`, payload, { withCredentials: true });
};

export default { createReview };
