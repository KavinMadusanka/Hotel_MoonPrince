import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  MapPin,
  Phone,
  MailIcon
} from "lucide-react";
import { PiWhatsappLogoThin } from "react-icons/pi";
import Logo from "../../public/Logo.png";
// import { createSubscription } from "../service/ApiService";
// import toast from "react-hot-toast";


const Footer = () => {
//   const [loading, setLoading] = useState(false);

//   const  handleSubmit = async(subEmail) => {
//     try {
//       setLoading(true);
//       const res = await createSubscription(subEmail)
//       console.log(res);
//       toast.success(res.data.message);
//       setSubEmail("");
      
//     } catch (error) {
//       console.error(error);
//       setSubEmail("");
//       toast.error(error.response?.data?.message);

//     } finally {
//       setLoading(false);
//     }

//   }
  return (
    <footer className="bg-[#1A1022] min-w-screen text-slate-900">

      <div className="max-w-full mx-auto px-10 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">

        {/* Left Section */}
        <div className="space-y-4 sm:col-span-2 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 text-white font-bold">
              <img src={Logo} alt="Logo" className="w-full h-full object-cover object-top" />
            </div>
            <span className="dark:text-white text-slate-900 font-semibold text-lg tracking-widest">
              Hotel MoonPrince
            </span>
          </div>

          <p className="text-sm leading-relaxed text-slate-400 px-3 tracking-widest">
            Defining hospitality through the lens of royal comfort and serene luxury since 2000. Experience the moonlight difference.
          </p>
        </div>

        {/* Sitemap */}
        
        <div className="sm:col-span-1">
          <h4 className="text-white font-semibold mb-4 tracking-widest">
            SITEMAP
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/home" className="text-slate-400! hover:text-white! tracking-widest transition ">Home</Link></li>
            <li><Link to="/rooms" className="text-slate-400! hover:text-white! tracking-widest transition">Rooms</Link></li>
            <li><Link to="/announcement" className="text-slate-400! hover:text-white! tracking-widest transition">Announcement</Link></li>
            <li><Link to="/about" className="text-slate-400! hover:text-white! tracking-widest transition">About</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className="sm:col-span-1">
          <h4 className="text-white font-semibold mb-4 tracking-widest">
            HOTEL INFO
          </h4>
          <ul className="space-y-3 text-sm text-slate-400!">
            <li><Link to="/home" className="text-slate-400! hover:text-white! tracking-widest transition ">Terms of Service</Link></li>
            <li><Link to="/rooms" className="text-slate-400! hover:text-white! tracking-widest transition">Privacy Policy</Link></li>
            <li><Link to="/announcement" className="text-slate-400! hover:text-white! tracking-widest transition">Accessibility</Link></li>
            <li><Link to="/about" className="text-slate-400! hover:text-white! tracking-widest transition">Cancellation Policy</Link></li>
          </ul>
        </div>
        {/* Newsletter Section */}
      {/* Contact Section */}
        <div className="sm:col-span-1">
          <h4 className="text-white  font-semibold mb-4 tracking-widest">
            CONTACT US
          </h4>
          <div className="flex flex-row text-sm gap-3 mb-4 text-slate-400 tracking-widest">
            <MapPin size={20} />
            <p>123 Royal Crescent, Moon valley, Cloud Kingdom 45902</p>
          </div>
          <div className="flex flex-row text-sm gap-3 mb-4 text-slate-400 tracking-widest">
            <Phone size={20} />
            <p>+94 11 234 5678</p>
          </div>
          <div className="flex flex-row text-sm gap-3 mb-4 text-slate-400 tracking-widest">
            <MailIcon size={20} />
            <p>info@hotelmoonprince.com</p>
          </div>
          
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-center">

          <p className="text-center justify-center flex text-sm text-slate-400  tracking-widest">
            © 2026 Hotel MoonPrince. All rights reserved.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
