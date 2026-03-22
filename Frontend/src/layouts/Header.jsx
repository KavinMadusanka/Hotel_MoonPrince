import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { HiX, HiMenu } from 'react-icons/hi';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { Bell, FileArchive, User, User2 } from 'lucide-react';
import Logo from '../../public/Logo.png';
import { useEffect } from 'react';
import { getUserDetails, logout } from '../apiService/userService';

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const activeLink = location.pathname;
    const [auth, setAuth] = useAuth();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({});
    // const [photo, setPhoto] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);;
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await getUserDetails();
                console.log(res)
                if (res.data.success) {
                    setUser(res.data.user);
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                console.log(error)
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await logout();
            if (res.data.success) {

                toast.success(res.data.message);
                localStorage.removeItem('auth');
                Cookies.remove('access_token');
                setAuth({ token: "" });
                navigate('/home');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };

    const navLinks = [
        {href : "/home", lable: "Home"},
        {href : "/guest-rooms", lable: "Rooms"},
        {href : "/home#amenities", lable: "Amenities"},
        {href : "/view-bill", lable: "Bills"},
        {href : "/announcements", lable: "Announcements"},
    ]



  return (
   <nav className='fixed top-0 left-0 right-0 bg-white backdrop-teal-sm backdrop-blur-md z-50  dark:border-gray-900 shadow-sm'>
            <div className='w-full container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-2 md:h-20 h-20'>
                {/*logo*/}
                <div className='flex items-center gap-1 cursor-pointer '>
                    {/* bg-teal-600 rounded-lg px-6 py-1  */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                        <img src={Logo} alt="Logo" 
                        className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className='ml-2 text-sm lg:text-xl font-medium text-purple-800 tracking-widest'>
                        Hotel MoonPrince
                    </div>
                </div>

                {/* Mobile menu button */}
                    <button onClick={() => setMenuOpen(!isMenuOpen)} className='md:hidden p-2 bg-white!'>
                        {
                            isMenuOpen ? <HiX className='size-8 text-purple-800 '/> : <HiMenu className='size-8 text-purple-800'/>
                        }
                    </button>
    
    
                {/*desktop nav*/}
                <div className='hidden md:flex items-center gap-10'>
                    {
                        navLinks.map((link, index) => (
                            <a key={index} href={link.href} 
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm lg:text-xl font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 
                                after:w-0 hover:after:w-full after:bg-purple-500 after:transition-all 
                                ${ activeLink === link.href ? "text-purple-500 after:w-full": "text-slate-500 dark:text-slate-400 hover:text-purple-500" }`}>
                                {link.lable}
                            </a> 
                        ))
                    }
                </div>
    
                
                {/*get touch button*/}
                    <div className='hidden md:flex gap-3 items-center'>
                    {/* Profile Icon */}
                    <span
                    // onClick={onClick}
                    className=" mr-5 flex items-center hover:opacity-75 transition text-gray-500 cursor-pointer"
                    ><Bell size={25}/></span>

                    <div clasname="relative">
                        <div
                            onClick={() => setOpen(!open)}
                            className="w-10 h-10 rounded-full bg-purple-800 flex justify-center items-center text-white font-bold cursor-pointer overflow-hidden"
                        >
                            {auth?.token && user?.photo ? (
                                <>
                                {!imageLoaded && <User2 size={24} />}
                                <img
                                    src={`${import.meta.env.VITE_USER_SERVICE_URL}${import.meta.env.VITE_API_VERSION}/userService/user_photos/${user.photo}`}   // replace with user image
                                    alt="profile"
                                    onLoad={() => setImageLoaded(true)}
                                    className="w-full h-full object-cover scale-200 object-top"
                                />
                                </>
                            ) : (
                            <User2 size={24} />
                            )}
                        </div>
                    </div>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                        
                        {auth?.token ? (
                            <>
                            <button
                                onClick={() => {
                                navigate("/profile");
                                setOpen(false);
                                }}
                                className="block w-full text-left text-purple-800 px-4 py-2 bg-white! hover:bg-gray-100! hover:border-gray-100!"
                            >
                                Profile
                            </button>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 bg-white! hover:bg-gray-100! hover:border-gray-100! text-red-500"
                            >
                                Sign Out
                            </button>
                            </>
                        ) : (
                            <button
                            onClick={() => {
                                navigate("/signin");
                                setOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-purple-800 bg-white! hover:bg-gray-100! hover:border-gray-100!"
                            >
                            Sign In
                            </button>
                        )}

                        </div>
                    )}
                    </div>
    
                {/*mobile menu */}
    
            </div>
    
            {/* mobile menu Items */}
            {
                isMenuOpen && (
                    <div className='md:hidden bg-purple-50 border-white  py-4'>
                        <div className='container mx-auto px-4 space-y-4'>
                            {navLinks.map((link, index) => (
                                <a key={index}
                                onClick={() => {
                                    setMenuOpen(false);
                                }}
                                className={`block text-sm font-medium py-2 ${activeLink === link.href ? "text-blue-500" : "text-slate-500 dark:text-slate-400 hover:text-blue-500"}`} href={link.href}>{link.lable}</a>
                            ))}
    
                            <div className='flex flex-col gap-1'>
                                {auth.token ? (
                                    <>
                                        <button 
                                        onClick={handleLogout}
                                        className='w-full text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-teal-100'>
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className='w-full bg-linear-to-r from-blue-600 to-blue-500 text-white hover:bg-blue-700 dark:text-teal-100 dark:bg-teal-800 dark:hover:bg-teal-900 px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-teal-100'>
                                            <a href="/signin">Sign in</a>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
    </nav>
  );
}

export default Header