import React from 'react'
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { ClipboardList, PlusCircle, UserSearch } from 'lucide-react';

const BillingPage = () => {
  return (
    <AdminPageLayout>
        <div className='relative min-h-screen w-full md:px-10 px-3 pb-10 '>
            <div>
                <p className='text-black 
                    text-3xl md:text-4xl lg-text-5xl font-bold tracking-wide mb-10'>
                    Create New Bill
                </p>
            </div>
        <section className='w-full flex flex-row'>

            {/* Left side view */}
            <div className='md:w-full w-2/3 space-y-8 z-10'>

                {/* Guest card */}
                <div className='border-white bg-white p-5 rounded-xl shadow-md w-full'>
                    <div className='relative flex flex-row gap-5 items-center mb-4'>
                        <UserSearch size={20} className='text-purple-800' />
                        <p className='text-black font-bold tracking-wider'>
                            Guest Details
                        </p>
                    </div>
                    <section className='w-full flex flex-row gap-4'>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Guest Name
                            </p>
                            <input type='text' className='border-2 border-gray-300 rounded-md p-1 w-auto' placeholder='Enter Guest Name' />
                        </div>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Room Number
                            </p>
                            <input type='text' className='border-2 border-gray-300 rounded-md p-1 w-auto' placeholder='Enter Room Number' />
                        </div>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Stay Duration
                            </p>
                            <div className='flex flex-row gap-2 items-center'>
                                <input type='text' className='border-2 border-gray-300 rounded-md p-1 w-17.5' placeholder='Enter Stay Duration' />
                                <p className='text-slate-400'>Nights</p>
                            </div>
                        </div>
                    </section>
                    
                </div>

                {/* Billing item card */}
                <div className='border-white bg-white p-5 rounded-xl shadow-md w-full'>
                    <section className='w-full flex flex-row gap-4'>
                        <div className='relative flex flex-row w-1/2 gap-5 items-center mb-4'>
                            <ClipboardList size={18} className="text-purple-800" />
                            <p className='text-black font-bold tracking-wider'>
                                Billing Items
                            </p>
                        </div>
                        <div className='relative flex flex-row w-1/2 gap-5 items-center mb-4 justify-end'>
                            <button className='text-white font-bold tracking-wider flex flex-row items-center gap-3'>
                                <PlusCircle size={20} className="text-white" />
                                Add New Item
                            </button>
                        </div>
                    </section>
                    
                </div>
            </div>

            {/* Right side view */}
            <div className='md:w-full w-1/3  pl-0 md:pl-12 text-blue-500 pt-1 md:pt-3' >
                <a href='/projects'>
                <p className='hidden md:flex flex-row justify-end'>
                    Explore all projects 
                </p>
                </a>
                <a href='/projects'>
                <p className='md:hidden flex justify-end'>
                    See All
                </p>
                </a>
            </div>
        </section>
        <div>
            <p className='dark:text-slate-400 text-slate-500
                md:hidden flex
                max-w-md md:max-w-md lg:max-w-md'>
                Selected works that demonstrate technical depth and design precision.
            </p>
        </div>
    </div>
    </AdminPageLayout>
  )
}

export default BillingPage