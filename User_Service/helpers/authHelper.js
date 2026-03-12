import JWT from 'jsonwebtoken';
import bycrypt from 'bcryptjs';

//password hashing function
export const hashPassword = async (password) => {
    try {
        const salt = await bycrypt.genSalt(10);
        const hash = await bycrypt.hash(password, salt);
        return hash;   
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
}

//password compaire function
export const comparePassword = async (password, hash) => {
    const isMatch = await bycrypt.compare(password, hash);
    return isMatch;
}

//token generation function
export const generateToken = async (payload) => {
    const token = await JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}