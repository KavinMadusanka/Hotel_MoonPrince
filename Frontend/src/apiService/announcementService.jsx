import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const GUEST_BASE = `${USER_SERVICE_URL}${API_VERSION}/guestService`;

export const createAnnouncement = async (formData) => {
  return axios.post(`${GUEST_BASE}/announcements`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const getActiveAnnouncements = async () => {
  return axios.get(`${GUEST_BASE}/announcements/active`);
};

export const getAllAnnouncements = async () => {
  return axios.get(`${GUEST_BASE}/announcements`);
};

export default {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
};
