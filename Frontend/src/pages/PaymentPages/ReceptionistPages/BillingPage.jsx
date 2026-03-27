import React, { useState } from 'react'
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { ClipboardList, PlusCircle, Printer, Receipt, Trash, UserSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRooms } from '../../../apiService/roomService';
import { getAllReservations, getBillDetails, removeItemFromBill } from '../../../apiService/PaymentService';
import { getUserDetailsById } from '../../../apiService/userService';
import AddBillingItemModal from './AddBillingItemModal';
import AddBillItemToBillModal from './AddBillItemToBillModel';

const BillingPage = () => {
    const [roomNumber, setRoomNumber] = useState("");
    const [billingItems, setBillingItems] = useState([]);
    const [reservation, setReservation] = useState(null);
    const [user, setUser] = useState(null);
    const [bill, setBill] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const roomCharges = billingItems
        .filter(item => item.ItemType === "Accommodation")
        .reduce((acc, item) => acc + item.QTY * item.UnitPrice, 0);

    const foodCharges = billingItems
        .filter(item => item.ItemType === "Food & Beverages")
        .reduce((acc, item) => acc + item.QTY * item.UnitPrice, 0);

    const additionalCharges = billingItems
        .filter(item => item.ItemType !== "Accommodation" && item.ItemType !== "Food & Beverages")
        .reduce((acc, item) => acc + item.QTY * item.UnitPrice, 0);

    const subTotal = billingItems.reduce(
        (acc, item) => acc + item.QTY * item.UnitPrice,
        0
    );

    const tax = subTotal * 0.10; // or dynamic later

    const total = subTotal + tax;

    const handleAddItem = async (reservation) => {
        setLoading(true);
        // console.log(reservation);
        const billDetails = await getBillDetails(reservation.userId, reservation.roomId);
        // console.log("Billing Details: ", billDetails.data.data.billingItems);
        setBillingItems(billDetails.data.data.billingItems);
        setBill(billDetails.data.data);
        setLoading(false);
    };


    const getBillingDetails = async (roomNumber) => {
        try {
            setLoading(true);
            setReservation(null);
            setBillingItems([]);
            setUser(null);
            
            const res = await getRooms();
            // console.log("Rooms Data: ", res)
            const room = res.data.find(r => r.roomNumber === roomNumber);
            // console.log("Found Room: ", room);

            const allReservations = await getAllReservations();
            // console.log("All Reservations: ", allReservations);

            const reservation = allReservations.data.data.find(res => res.roomId === room._id && res.status === "checked_in");
            console.log("Found Reservation: ", reservation);

            if (!reservation) {
                toast.error("There is no active reservation for this room.");
                return;
            }
            setReservation(reservation);
            const userDetails = await getUserDetailsById(reservation.userId);
            console.log("User Details: ", userDetails);
            setUser(userDetails.data.user);
            handleAddItem(reservation);

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteItem = async (id) => {
        const updatedItems = await removeItemFromBill(bill._id, id);
        console.log(updatedItems.data.data.billingItems);
        setBillingItems(updatedItems.data.data.billingItems);
    };

  return (
    <AdminPageLayout>
        <div className='relative min-h-screen w-full md:px-10 md:p-6 p-5 px-3 pb-10'>
            <div className='relative flex flex-row justify-between'>
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs border font-semibold text-violet-700">
                        <ClipboardList size={14} />
                        Receptionist Panel
                    </div>
                    <p className='text-black 
                        text-[20px] font-bold tracking-wide mb-10'>
                        Create New Bill
                    </p>
                </div>

                <div className='relative flex flex-row w-1/2 gap-5 items-center mb-4 justify-end'>
                    <button
                        onClick={() => setShowModal(true)}
                        className='text-white font-bold tracking-wider flex flex-row items-center gap-3'
                    >
                        <PlusCircle size={20} className="text-white" />
                        Add New item types
                    </button>
                </div>
            </div>
        <section className='w-full flex flex-col md:flex-row gap-5 md:gap-0'>

            {/* Left side view */}
            <div className='md:w-2/3 w-full space-y-8 z-10'>

                {/* Guest card */}
                <div className='border-white bg-white p-5 rounded-xl shadow-md w-full'>
                    <div className='relative flex flex-row gap-5 items-center mb-4'>
                        <UserSearch size={20} className='text-purple-800' />
                        <p className='text-black font-bold tracking-wider'>
                            Guest Details
                        </p>
                    </div>
                    <section className='w-auto flex flex-row gap-4'>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Guest Name
                            </p>
                            <input type='text' className='bg-purple-50 border-2 border-gray-300 text-black rounded-md p-1 w-auto text-center'
                            value={user?.name || ''} />
                        </div>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Room Number
                            </p>
                            <input type='text' className='bg-purple-50 border-2 border-gray-300 text-black rounded-md p-1 w-auto text-center' placeholder='Enter Room Number' 
                                value={roomNumber} 
                                onChange={(e) => setRoomNumber(e.target.value)}
                                onBlur={() => getBillingDetails(roomNumber)}
                            />
                        </div>
                        <div className='gap-3 flex flex-col'>
                            <p className='text-black font-medium'>
                                Stay Duration
                            </p>
                            <div className='flex flex-row gap-2 items-center '>
                                <input type='text' className='bg-purple-50 border-2 border-gray-300 text-black  rounded-md p-1 w-10 text-center'
                                    value={reservation?.nights || ''}  />
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
                            <button
                            onClick={() => setShowAddItemModal(true)} 
                            className='text-white font-bold tracking-wider flex flex-row items-center gap-3'>
                                <PlusCircle size={20} className="text-white" />
                                Add New Item
                            </button>
                        </div>
                    </section>
                    {/* Billing items will be displayed here */}
                    {!roomNumber ? (
                        <div className="col-span-3 flex flex-col items-center justify-center py-10">
                            <p className="text-gray-500 mt-3">Enter a room number to view billing details</p>
                        </div>
                    ) :  (
                        <>
                        {loading ? (
                        <div className="col-span-3 flex flex-col items-center justify-center py-10">
                            <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 mt-3">Loading billing details...</p>
                        </div>
                        ) : (
                            <>
                            {roomNumber && !reservation ? (
                                <div className="col-span-3 flex flex-col items-center justify-center py-10">
                                    <p className="text-gray-500 mt-3">There is no active reservation for this room.</p>
                                </div>
                            ) : ( 
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left border ">
                                    <thead className="bg-gray-100 text-black">
                                    <tr>
                                        <th className="p-2">Item Type</th>
                                        <th className="p-2">Description</th>
                                        <th className="p-2">QTY</th>
                                        <th className="p-2">Unit Price (LKR)</th>
                                        <th className="p-2">Sub Total (LKR)</th>
                                        <th className="p-2 text-center">Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {billingItems.length > 0 ? (
                                        billingItems.map((item, index) => {
                                        const subTotal = item.QTY * item.UnitPrice;

                                        return (
                                            <tr key={item._id || index} className="border-t text-black">
                                            <td className="p-2">{item.ItemType}</td>
                                            <td className="p-2">{item.Description}</td>
                                            <td className="p-2">{item.QTY}</td>
                                            <td className="p-2">{item.UnitPrice}</td>
                                            <td className="p-2 font-bold">
                                                {subTotal}
                                            </td>

                                            <td className="p-2 text-center">
                                                <button
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="text-red-500 hover:text-red-700 bg-white! border-none!"
                                                >
                                                <Trash size={20} />
                                                </button>
                                            </td>
                                            </tr>
                                        );
                                    })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4 text-gray-400">
                                                No billing items found
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            )}
                            </>
                        )}
                    </>
                    )}
                </div>
            </div>

            {/* Right side view */}
            <div className='md:w-1/3 w-full  pl-0 md:pl-12 pt-1 md:pt-3' >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        
                    {/* HEADER */}
                    <div className="bg-[#6A0DAD] p-5 text-white">
                    <h2 className="text-lg font-semibold">Billing Summary</h2>
                    <p className="text-sm opacity-90">
                        Review items and finalize payment
                    </p>
                    </div>

                    {/* BODY */}
                    <div className="p-5 space-y-4 text-gray-700">
                    
                    {/* Charges */}
                    <div className="flex justify-between">
                        <span>Room Charges</span>
                        <span>Rs. {roomCharges.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Food & Beverages</span>
                        <span>Rs. {foodCharges.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Additional Services</span>
                        <span>Rs. {additionalCharges.toLocaleString()}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>Rs. {subTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span>Rs. {tax.toLocaleString()}</span>
                    </div>

                    {/* TOTAL */}
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex justify-between items-center mt-4">
                        <span className="text-purple-700 font-semibold">
                        Total Amount
                        </span>
                        <span className="text-yellow-500 text-xl font-bold">
                        Rs. {total.toLocaleString()}
                        </span>
                    </div>

                    {/* PAYMENT METHOD */}
                    {/* <div className="mt-5 relative flex -flex-row justify-between">
                        <p className="text-xs text-gray-400 mb-1 items-center flex">
                        CASH PAYMENT
                        </p>
                        <button className='text-white'>
                            Pay
                        </button>

                        <div className="w-full relative flex flex-row justify-between border rounded-lg p-2">
                        <p className="flex items-center">Cash</p>
                        </div>
                    </div> */}

                    {/* PAYMENT STATUS */}
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                        PAYMENT STATUS
                        </p>

                        <div className="flex items-center gap-2">

                        <span className="text-purple-600 text-sm font-medium">
                            {bill?.status}
                        </span>
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-6 space-y-3">
                        
                        <button className="w-full text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90">
                        <Printer size={18} />
                        Generate Invoice
                        </button>

                        <button className="w-full text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90">
                        <Receipt size={18} />
                            Paid
                        </button>

                        <button className="w-full border border-purple-300 text-white py-3 rounded-xl hover:bg-purple-50">
                        Send to Guest Email
                        </button>

                    </div>

                    </div>
                </div>
            </div>
        </section>
        {/* <div>
            <p className='dark:text-slate-400 text-slate-500
                md:hidden flex
                max-w-md md:max-w-md lg:max-w-md'>
                Selected works that demonstrate technical depth and design precision.
            </p>
        </div> */}
        <AddBillingItemModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onAdd={handleAddItem}
            reservation={reservation}
        />
        <AddBillItemToBillModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onAdd={handleAddItem}
            bill={bill}
            reservation={reservation}
        />
    </div>
    </AdminPageLayout>
  )
}

export default BillingPage