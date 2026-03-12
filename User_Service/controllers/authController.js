import { contactNumberValidator, emailValidator, passwordValidator, textValidator } from '../helpers/validator.js';
import user from '../models/userModel.js';
import { comparePassword, generateToken, hashPassword } from '../helpers/authHelper.js';

//register new user
export const register = async (req, res) => {
    try {
        const { name, email, password, contactNumber, role } = req.body;
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists."
            })
        }

        //input validation part
        if(!textValidator(name)) return res.status(400).json({
            success: false,
            message: "Name should only contain letters and spaces."
        })
        if(!emailValidator(email)) return res.status(400).json({
            success: false,
            message: "Invalid email format."
        })
        if(!passwordValidator(password)) return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
        })
        if(!contactNumberValidator(contactNumber)) return res.status(400).json({
            success: false,
            message: "Invalid contact number format. It should be in the format +947XXXXXXXXX."
        })

        //password hashing part
        const hashedPassword = await hashPassword(password);

        
        const newUser = await user.create({
            name: name,
            email: email,
            password: hashedPassword,
            contactNumber: contactNumber,
            role: role,
            photo: req.file ? req.file.filename : null
        });
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Side Error."
        })
    }
}

//login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            })
        }

        const isPasswordMatch = await comparePassword(password, existingUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials."
            })
        }

        const token = await generateToken({ id: existingUser._id, role: existingUser.role });

         res.cookie('access_token',token,{
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "Login successful.",
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error."
        });
    }
}

//get all details'
export const getUserDetails = async(req, res) => {
    try {
        const {id} = req.user;
        const existingUser = await user.findById(id).select("-password");
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User does not exist."
            })
        }
        res.status(200).json({
            success: true,
            message: "User details retrieved successfully.",
            user: existingUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}

//update user details
export const updateUserDetails = async(req, res) => {
    try {
        const {id} = req.user;
        const {name , contactNumber} = req.body;
        
        const existingUser = await user.findById(id);
        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "your account not found."
            })
        }

        if(name){
            if(!textValidator(name)) return res.status(400).json({
                success: false,
                message: "Name should only contain letters and spaces."
            })
            existingUser.name = name;
        }
        if(contactNumber){
            if(!contactNumberValidator(contactNumber)) return res.status(400).json({
                success: false,
                message: "Invalid contact number format. It should be in the format +947XXXXXXXXX."
            })
            existingUser.contactNumber = contactNumber;
        }

        if(req.file){
            existingUser.photo = req.file.filename;
        }

        await existingUser.save();

        res.status(200).json({
            success: true,
            message: "User details updated successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}

//remove your account
export const deleteAccount = async (req, res) => {
    try {
        const {id} = req.user;
        const existingUser = await user.findByIdAndDelete(id);
        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "Account not found."
            })
        }
        res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error."
        })
    }
}

//logout function
export const logout = async (req, res) => {
    try {
        res.clearCookie('access_token').status(200).json({
        success: true,
        message: "SignOut Successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Side Error."
        })
    }
}