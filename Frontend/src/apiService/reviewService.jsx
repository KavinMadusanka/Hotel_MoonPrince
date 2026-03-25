import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const GUEST_BASE = `${USER_SERVICE_URL}${API_VERSION}/guestService`;

export const createReview = async (payload) => {
	return axios.post(`${GUEST_BASE}/reviews`, payload, { withCredentials: true });
};

export const getReviewsByUser = async (userId) => {
	const url = userId ? `${GUEST_BASE}/reviews/user/${userId}` : `${GUEST_BASE}/reviews/user`;
	return axios.get(url, { withCredentials: true });
};

export const updateReview = async (id, payload) => {
	return axios.put(`${GUEST_BASE}/reviews/${id}`, payload, { withCredentials: true });
};

export const deleteReview = async (id) => {
	return axios.delete(`${GUEST_BASE}/reviews/${id}`, { withCredentials: true });
};

export const getReviewsByRoomType = async (roomTypeId) => {
	return axios.get(`${GUEST_BASE}/reviews/room/${roomTypeId}`);
};

export const pinReview = async (id) => {
	return axios.put(`${GUEST_BASE}/reviews/pin/${id}`, {}, { withCredentials: true });
};

export const unpinReview = async (id) => {
	return axios.put(`${GUEST_BASE}/reviews/unpin/${id}`, {}, { withCredentials: true });
};

export default { createReview, getReviewsByUser, updateReview, deleteReview, getReviewsByRoomType, pinReview, unpinReview };
