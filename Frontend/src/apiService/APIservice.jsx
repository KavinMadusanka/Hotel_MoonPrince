import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const login = async(email, password) => {
    const res =  await axios.post(`${USER_SERVICE_URL}${API_VERSION}/user/login`, {
        email,
        password
    });
    return res;
}

export const register = async(name, email, password) => {
    const res =  await axios.post(`${USER_SERVICE_URL}${API_VERSION}/user/register`, {
        name,
        email,
        password
    });
    return res;
}

