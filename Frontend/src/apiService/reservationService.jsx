import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const createReservation = async (reservationData) => {
  const res = await axios.post(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations`,
    reservationData,
    { withCredentials: true }
  );
  return res;
};

export const getAllReservations = async () => {
  const res = await axios.get(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations`,
    { withCredentials: true }
  );
  return res;
};

export const getReservationById = async (id) => {
  const res = await axios.get(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations/${id}`,
    { withCredentials: true }
  );
  return res;
};

export const getReservationsByUserId = async (userId) => {
  const res = await axios.get(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations/user/${userId}`,
    { withCredentials: true }
  );
  return res;
};

export const updateReservation = async (id, payload) => {
  const res = await axios.put(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations/${id}`,
    payload,
    { withCredentials: true }
  );
  return res;
};

export const confirmReservation = async (id) => {
  const res = await axios.post(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations/${id}/confirm`,
    {},
    { withCredentials: true }
  );
  return res;
};

export const cancelReservation = async (id, cancellationReason = "") => {
  const res = await axios.post(
    `${API_BASE_URL}${API_VERSION}/reservations/api/v1/reservations/${id}/cancel`,
    { cancellationReason },
    { withCredentials: true }
  );
  return res;
};

export const checkInReservation = async (id) => {
  const res = await axios.post(
    `${API_BASE_URL}${API_VERSION}/checkinout/api/v1/checkinout/${id}/check-in`,
    {},
    { withCredentials: true }
  );
  return res;
};

export const checkOutReservation = async (id) => {
  const res = await axios.post(
    `${API_BASE_URL}${API_VERSION}/checkinout/api/v1/checkinout/${id}/check-out`,
    {},
    { withCredentials: true }
  );
  return res;
};