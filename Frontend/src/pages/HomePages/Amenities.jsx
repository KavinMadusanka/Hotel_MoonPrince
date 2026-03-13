import { ConciergeBell, Dumbbell, Leaf, Utensils, Waves, Wifi } from 'lucide-react';
import React from 'react'

const Amenities = () => {
  return (
    <div id="amenities" className='justify-center items-center flex flex-col gap-10 py-20 px-5'>
        <span className='text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 tracking-widest text-center
        relative inline-block pb-2
        after:block after:h-1 after:w-1/3 after:mx-auto after:bg-[#D4AF37] after:mt-2 after:rounded-full'>
            World-class Amenities
        </span>

        {/* Amenities */}
        <div className='relative flex flex-col md:flex-row md:gap-15 gap-5 tracking-widest'>
            <div className='flex flex-row md:gap-15 gap-5'>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <Wifi size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">Free Wifi</p>
                </div>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <Waves size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">Infinity Pool</p>
                </div>
            </div>
            <div className='flex flex-row md:gap-15 gap-5'>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <Leaf size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">Luxury Spa</p>
                </div>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <Utensils size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">Fine Dining</p>
                </div>
            </div>
            <div className='flex flex-row md:gap-15 gap-5'>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <Dumbbell size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">GYM & Yoga</p>
                </div>
                <div className='border border-white bg-white text-purple-800 flex flex-col w-40 h-40 rounded-xl justify-center items-center gap-4 shadow-2xl'>
                    <ConciergeBell size={40} className='flex justify-center'/>
                    <p className="font-bold text-lg ">Room Service</p>
                </div>
            </div>

        </div>

    </div>
  )
}

export default Amenities