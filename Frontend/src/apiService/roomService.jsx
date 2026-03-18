import axios from "axios";

const ROOM_INVENTORY_SERVICE_URL = import.meta.env.VITE_ROOM_INVENTORY_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const getRoomTypes = async () => {
  const res = await axios.get(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/room-types`
  );
  return res;
};

export const getRoomTypeById = async (id) => {
  const res = await axios.get(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/room-types/${id}`
  );
  return res;
};

export const createRoomType = async (formData) => {
  const res = await axios.post(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/room-types`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res;
};

export const updateRoomType = async (id, formData) => {
  const res = await axios.patch(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/room-types/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res;
};

export const deleteRoomType = async (id) => {
  const res = await axios.delete(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/room-types/${id}`
  );
  return res;
};

export const getRooms = async () => {
  const res = await axios.get(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/rooms`
  );
  return res;
};

export const createRoom = async (roomData) => {
  const res = await axios.post(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/rooms`,
    roomData
  );
  return res;
};

export const updateRoom = async (id, roomData) => {
  const res = await axios.patch(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/rooms/${id}`,
    roomData
  );
  return res;
};

export const deleteRoom = async (id) => {
  const res = await axios.delete(
    `${ROOM_INVENTORY_SERVICE_URL}${API_VERSION}/rooms/${id}`
  );
  return res;
};