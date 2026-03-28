import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const ROOM_INVENTORY_BASE = `${USER_SERVICE_URL}${API_VERSION}/roomInventoryService`;

//const token = localStorage.getItem("token");
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

export const getRoomTypes = async () => {
  return axios.get(`${ROOM_INVENTORY_BASE}/room-types`, {
    withCredentials: true,
  });
};

export const getRoomTypeById = async (id) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/room-types/${id}`, {
    withCredentials: true,
  });
};

export const getAvailability = async ({ roomTypeId, checkIn, checkOut, qty = 1 }) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/availability`, {
    withCredentials: true,
    params: { roomTypeId, checkIn, checkOut, qty },
  });
};

export const createRoomType = async (formData) => {
  return axios.post(`${ROOM_INVENTORY_BASE}/room-types`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateRoomType = async (id, formData) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/room-types/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteRoomType = async (id) => {
  return axios.delete(`${ROOM_INVENTORY_BASE}/room-types/${id}`, {
    withCredentials: true,
  });
};

export const createRoom = async (payload) => {
  return axios.post(`${ROOM_INVENTORY_BASE}/rooms`, payload, {
    withCredentials: true,
  });
};

export const getRooms = async () => {
  return axios.get(`${ROOM_INVENTORY_BASE}/rooms`, {
    withCredentials: true,
  });
};

export const updateRoom = async (id, payload) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/rooms/${id}`, payload, {
    withCredentials: true,
  });
};

export const deleteRoom = async (id) => {
  return axios.delete(`${ROOM_INVENTORY_BASE}/rooms/${id}`, getAuthHeader());
};

export const updateRoomStatus = async (id, payload) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/rooms/${id}/status`, payload, {
    withCredentials: true,
  });
};

export const getHolds = async ({ status = "all", search = "" } = {}) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/holds`, {
    withCredentials: true,
    params: {
      status,
      search,
    },
  });
};

export const getHoldById = async (id) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/holds/${id}`, {
    withCredentials: true,
  });
};

export const confirmHold = async (holdId) => {
  return axios.post(
    `${ROOM_INVENTORY_BASE}/holds/${holdId}/confirm`,
    {},
    {
      withCredentials: true,
    }
  );
};

export const releaseHold = async (holdId) => {
  return axios.post(
    `${ROOM_INVENTORY_BASE}/holds/${holdId}/release`,
    {},
    {
      withCredentials: true,
    }
  );
};