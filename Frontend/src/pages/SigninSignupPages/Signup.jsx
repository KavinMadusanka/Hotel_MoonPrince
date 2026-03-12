import React from 'react'
import image from '../../assets/beach.jpg'
import { Eye, EyeOff, User, Lock, UserPlus } from "lucide-react";
import { useState } from 'react';
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { register } from '../../apiService/apiService';
import logo from '../../../public/Logo.png'

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactnumber: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
    });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        // password match validation
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const res = await register(formData.name,formData.email, formData.contactnumber, formData.password);
        console.log("res",res);
        if (!res.data.success) {
            throw new Error(res.data.message);
        }

        if (res.data.success) {
            toast.success(res.data.message);
            navigate("/signin");
        }
        } catch (error) {
        toast.error(error.response.data.message || "Server Error");
        } finally {
        setIsLoading(false);
        }
    };

  return (
    <div className='relative w-screen min-h-screen bg-purple-50'>
        <section className='w-full flex flex-col md:flex-row'>
            {/* left side */}
            <div className='relative w-full min-h-screen md:w-1/2 z-1 '>
                <img src={image} alt="logo" className='w-full min-h-screen object-cover' />
                
                {/* Purple Overlay */}
                <div className="absolute w-full inset-0 bg-linear-to-b from-purple-900/10 to-purple-950"></div>

                <div className='absolute top-4 px-6 items-center p-4 tracking-widest font-bold text-xl flex flex-row gap-4'>
                  <img src={logo} alt="Logo" className='w-10 h-10' />
                  <p className='justify-center text-center'>Hotel MoonPrince</p>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-left justify-center text-left px-6 wrap-break-word gap-3">
                  <p className="text-white text-5xl md:text-6xl font-bold tracking-wide">
                    Join Hotel
                  </p>
                  <p className="text-[#D4AF37] text-5xl md:text-6xl font-bold">
                    MoonPrince
                  </p>
                  <p className="text-white tracking-widest text-lg md:text-xl max-w-xs md:max-w-lg">
                    Step into a wolrd of celestial luxury and royal comfort.
                    Your journey to the extraordinary begins here.
                  </p>
                </div>
                <div className='absolute tracking-widest bottom-0 left-0 right-0 p-4'>
                  <p>© 2026 Hotel MoonPrince. All rights reserved.</p>
                </div>
            </div>
            {/* Right side */}
            <div className='w-full md:w-1/2 justify-center items-center flex p-10'>
                <div className=' my-12 lg:my-0 border-2 rounded-3xl shadow-lg p-10 justify-center bg-white gap-5 flex flex-col'>
                    <p className='text-purple-800 text-3xl font-bold tracking-wide'>Create Your Account</p>
                    <p className='text-gray-500'>Please fill in your details ot experience royal luxury.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1 text-left flex flex-col">
                            <label className="text-sm font-medium text-purple-800">
                            Name
                            </label>
                            <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-600" size={18} />
                            <input
                                type="text"
                                required
                                placeholder="Enter your name"
                                className="w-full pl-10 mb-5 pr-4 py-3 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                value={formData.name}
                                onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            </div>
                            <label className="text-sm font-medium text-purple-800">
                            Email
                            </label>
                            <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-600" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 mb-5 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                value={formData.email}
                                onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            </div>
                            <label className="text-sm font-medium text-purple-800">
                            Contact Number
                            </label>
                            <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-600" size={18} />
                            <input
                                type="tel"
                                required
                                placeholder="Enter your contact number"
                                className="w-full pl-10 pr-4 py-3 mb-5 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                value={formData.contactnumber}
                                onChange={(e) =>
                                setFormData({ ...formData, contactnumber: e.target.value })
                                }
                            />
                            </div>
                            {/* Password */}
                            <div className="space-y-1 text-left ">
                                <label className="text-sm font-medium text-purple-800">Password</label>

                                <div className="relative mb-5">
                                    <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                    />

                                    <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    />

                                    <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition"
                                    >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </span>
                                </div>
                                {/* Confirm password */}
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-purple-800">
                                    Confirm Password
                                </label>
                                    <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-10 py-3 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value
                                        })
                                        } />
                                    <span
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </span>
                                    </div>
                            </div>
                                <div className="mt-1 pt-3 pb-3">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 w-4 h-4 accent-purple-500 bg-white border-purple-500 rounded focus:ring-purple-500"
                                        checked={formData.agreeTerms}
                                        onChange={(e) =>
                                            setFormData({
                                            ...formData,
                                            agreeTerms: e.target.checked
                                            })
                                        }
                                        />

                                    <span className="text-sm text-gray-600">
                                        I agree to the{' '}
                                        <a href="#" className="font-medium hover:underline">
                                        Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="font-medium hover:underline">
                                        Privacy Policy
                                        </a>
                                    </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex mb-5 items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-md text-white hover:opacity-90 disabled:opacity-60"
                                >
                                    <UserPlus size={18} />
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </button>
                            
                        </div>
                    </form>
                    <div>
                      <div className='flex items-center pb-6'>
                        <div className="grow border-t border-gray-300"></div>
                      </div>
                      <p className="text-sm text-gray-600 gap-2 flex items-center justify-center">
                        Already have an account ?
                        <Link
                            to="/signin"
                            className="font-bold"
                        >
                            Login Now
                        </Link>
                        </p>
                    </div>
                </div>
            </div>

        </section>
    </div>
  )
}

export default Signup