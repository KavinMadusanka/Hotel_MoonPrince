import React from 'react'
import image from '../../assets/beach.jpg'
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import { useAuth } from '../../context/auth';
import { useState } from 'react';
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { login } from '../../apiService/apiService';
import logo from '../../../public/Logo.png'

const Signin = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();

    const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(formData.email, formData.password);
    //   const data = await response.json();
    console.log("res",res);
      if (!res.data.success) {
        throw new Error(res.data.message || "Login failed");
      }

      if (res.data.success) {
        const { token } = res.data.token;

        setAuth({
          ...auth,
          token,
        });

        toast.success("Login Successful");
        Cookies.set("access_token", token, { expires: 1 });
        localStorage.setItem("token", token);

        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message || "Server Error");
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
                  <p className="text-white text-4xl md:text-6xl font-bold tracking-wide">
                    Welcome Back to
                  </p>
                  <p className="text-[#D4AF37] text-5xl md:text-7xl font-bold">
                    Hotel
                  </p>
                  <p className="text-[#D4AF37] text-5xl md:text-7xl font-bold">
                    MoonPrince
                  </p>
                  <p className="text-white tracking-widest text-lg md:text-xl max-w-xs md:max-w-lg">
                    Experience Royal Comfort and unparalleled luxury in every stay.
                  </p>
                </div>
                <div className='absolute bottom-0 left-0 right-0 p-4'>
                  <p>© 2026 Hotel MoonPrince. All rights reserved.</p>
                </div>
            </div>
            {/* Right side */}
            <div className='w-full md:w-1/2 justify-center items-center flex p-10'>
                <div className=' my-12 lg:my-0 border-2 rounded-3xl shadow-lg p-10 justify-center bg-white gap-5 flex flex-col'>
                    <p className='text-black text-3xl font-bold tracking-wide'>Login to Your Account</p>
                    <p className='text-gray-500'>Please enter your credentials to access your booking</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1 text-left gap-5 flex flex-col">
                            <label className="text-sm text-gray-600">
                            Email or Username
                            </label>
                            <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-500 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition"
                                value={formData.email}
                                onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            </div>
                            {/* Password */}
                            <div className="space-y-1 text-left">
                            <label className="text-sm text-gray-600">Password</label>

                            <div className="relative">
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

                            <div className="text-right mt-1 pt-3 pb-3">
                                <Link
                                to="/forget-password"
                                className="inline-flex items-center text-sm font-medium text-gray-600 "
                                >
                                Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium shadow-md text-white hover:opacity-90 disabled:opacity-60"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                                <LogIn size={18} />
                            </button>
                            </div>
                        </div>
                    </form>
                    <div>
                      <div className='flex items-center pb-6'>
                        <div className="grow border-t border-gray-300"></div>
                        <span className="mx-3 text-gray-500">or continue with</span>
                        <div className="grow border-t border-gray-300"></div>
                      </div>
                      <p className="text-sm text-gray-600 gap-2 flex items-center justify-center">
                        Don't have an account?
                        <Link
                            to="/signup"
                            className="font-medium"
                        >
                            Sign Up
                        </Link>
                        </p>
                    </div>
                </div>
            </div>

        </section>
    </div>
  )
}

export default Signin