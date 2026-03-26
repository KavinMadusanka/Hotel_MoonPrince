import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const GUEST_BASE = `${USER_SERVICE_URL}${API_VERSION}/guestService`;

const getAuthHeader = () => {
	const token = localStorage.getItem("token");
	return {
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
};

export const createReview = async (payload) => {
	return axios.post(`${GUEST_BASE}/reviews`, payload, getAuthHeader());
};

export const getReviewsByUser = async (userId) => {
	const url = userId ? `${GUEST_BASE}/reviews/user/${userId}` : `${GUEST_BASE}/reviews/user`;
	return axios.get(url, getAuthHeader());
};

export const updateReview = async (id, payload) => {
	return axios.put(`${GUEST_BASE}/reviews/${id}`, payload, getAuthHeader());
};

export const deleteReview = async (id) => {
	return axios.delete(`${GUEST_BASE}/reviews/${id}`, getAuthHeader());
};

export const getReviewsByRoomType = async (roomTypeId) => {
	return axios.get(`${GUEST_BASE}/reviews/room/${roomTypeId}`);
};

export const getAllReviews = async () => {
	return axios.get(`${GUEST_BASE}/reviews/all`);
};

export const pinReview = async (id) => {
	return axios.put(`${GUEST_BASE}/reviews/pin/${id}`, {}, getAuthHeader());
};

export const unpinReview = async (id) => {
	return axios.put(`${GUEST_BASE}/reviews/unpin/${id}`, {}, getAuthHeader());
};

export default { createReview, getReviewsByUser, getAllReviews, updateReview, deleteReview, getReviewsByRoomType, pinReview, unpinReview };
