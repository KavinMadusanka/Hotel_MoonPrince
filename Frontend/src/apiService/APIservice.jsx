import axios from "axios";

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const login = async(email, password) => {
    const res =  await axios.post(`${USER_SERVICE_URL}${API_VERSION}/userService/user/login`, {
        email,
        password
    });
    return res;
}

export const register = async(name, email, contactNumber, password) => {
    const res =  await axios.post(`${USER_SERVICE_URL}${API_VERSION}/userService/user/register`, {
        name,
        email,
        contactNumber,
        password,
        role:0
    });
    console.log(res);
    return res;
}

export const logout = async() => {
    const res = await axios.post(`${USER_SERVICE_URL}${API_VERSION}/userService/user/logout`,
        {},
        {
            withCredentials: true,
        });
    return res;
}

export const getUserDetails = async() => {
    const res = await axios.get(`${USER_SERVICE_URL}${API_VERSION}/userService/user/get-user-details`, {
        withCredentials: true,
    });
    return res;
}
