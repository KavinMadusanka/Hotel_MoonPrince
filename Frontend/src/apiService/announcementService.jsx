import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const GUEST_BASE = `${USER_SERVICE_URL}${API_VERSION}/guestService`;

const getAuthHeader = (contentType = null) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  return {
    withCredentials: true,
    headers
  };
};

export const createAnnouncement = async (formData) => {
  return axios.post(`${GUEST_BASE}/announcements`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`
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

export const deleteAnnouncement = async (id) => {
  return axios.delete(`${GUEST_BASE}/announcements/${id}`, getAuthHeader());
};

export const pinAnnouncement = async (id) => {
  return axios.put(`${GUEST_BASE}/announcements/pin/${id}`, {}, getAuthHeader());
};

export const publishAnnouncement = async (id) => {
  return axios.put(`${GUEST_BASE}/announcements/publish/${id}`, {}, getAuthHeader());
};

export const getAnnouncement = async (id) => {
  return axios.get(`${GUEST_BASE}/announcements/${id}`);
};

export const updateAnnouncement = async (id, formData) => {
  return axios.put(`${GUEST_BASE}/announcements/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    withCredentials: true,
  });
};

export default {
  createAnnouncement,
  getActiveAnnouncements,
  getAllAnnouncements,
  deleteAnnouncement,
  pinAnnouncement,
  publishAnnouncement,
  getAnnouncement,
  updateAnnouncement,
};
