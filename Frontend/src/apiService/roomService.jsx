import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const ROOM_INVENTORY_BASE = `${USER_SERVICE_URL}${API_VERSION}/roomInventoryService`;

export const getRoomTypes = async () => {
  return axios.get(`${ROOM_INVENTORY_BASE}/room-types`);
};

export const getRoomTypeById = async (id) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/room-types/${id}`);
};

export const getAvailability = async ({
  roomTypeId,
  checkIn,
  checkOut,
  qty = 1
}) => {
  return axios.get(`${ROOM_INVENTORY_BASE}/availability`, {
    params: {
      roomTypeId,
      checkIn,
      checkOut,
      qty
    }
  });
};

export const createRoomType = async (formData) => {
  return axios.post(`${ROOM_INVENTORY_BASE}/room-types`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateRoomType = async (id, formData) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/room-types/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteRoomType = async (id) => {
  return axios.delete(`${ROOM_INVENTORY_BASE}/room-types/${id}`);
};

export const createRoom = async (payload) => {
  return axios.post(`${ROOM_INVENTORY_BASE}/rooms`, payload);
};

export const getRooms = async () => {
  return axios.get(`${ROOM_INVENTORY_BASE}/rooms`);
};

export const updateRoom = async (id, payload) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/rooms/${id}`, payload);
};

export const deleteRoom = async (id) => {
  return axios.delete(`${ROOM_INVENTORY_BASE}/rooms/${id}`);
};

export const updateRoomStatus = async (id, payload) => {
  return axios.patch(`${ROOM_INVENTORY_BASE}/rooms/${id}/status`, payload);
};