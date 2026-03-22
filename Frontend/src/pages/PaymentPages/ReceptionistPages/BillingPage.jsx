import React from 'react'
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import { ClipboardList, PlusCircle, Trash, UserSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRooms } from '../../../apiService/roomService';
import { getAllReservations, getBillDetails } from '../../../apiService/PaymentService';
import { getUserDetailsById } from '../../../apiService/userService';
import AddBillingItemModal from './AddBillingItemModal';
import AddBillItemToBillModal from './AddBillItemToBillModel';

const BillingPage = () => {
    const [roomNumber, setRoomNumber] = React.useState("");
    const [billingItems, setBillingItems] = React.useState([]);
    const [reservation, setReservation] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [billId, setBillId] = React.useState(null);

    const [showModal, setShowModal] = React.useState(false);
    const [showAddItemModal, setShowAddItemModal] = React.useState(false);

    const handleAddItem = async (reservation) => {
        // console.log(reservation);
        const billDetails = await getBillDetails(reservation.userId, reservation.roomId);
        // console.log("Billing Details: ", billDetails.data.data.billingItems);
        setBillingItems(billDetails.data.data.billingItems);
        setBillId(billDetails.data.data._id);
    };


    const getBillingDetails = async (roomNumber) => {
        try {
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
            // console.log("Found Reservation: ", reservation);

            if (!reservation) {
                toast.error("There is no active reservation for this room.");
                return;
            }
            setReservation(reservation);
            const userDetails = await getUserDetailsById(reservation.userId);
            // console.log("User Details: ", userDetails);
            setUser(userDetails.data.user);
            handleAddItem(reservation);
            // const billDetails = await getBillDetails(reservation.userId, reservation.roomId);
            // console.log("Billing Details: ", billDetails.data.data.billingItems);
            // setBillingItems(billDetails.data.data.billingItems);
            // setBillId(billDetails.data.data._id);


        } catch (error) {
            toast.error(error.response.data.message || "Server Error");
        }
    }

    const handleDeleteItem = (id) => {
        const updatedItems = billingItems.filter(item => item._id !== id);
        setBillingItems(updatedItems);
    };

  return (
    <AdminPageLayout>
        <div className='relative min-h-screen w-full md:px-10 px-3 pb-10 '>
            <div className='relative flex flex-row justify-between'>
                <p className='text-black 
                    text-3xl md:text-4xl lg-text-5xl font-bold tracking-wide mb-10'>
                    Create New Bill
                </p>
                <button
                    onClick={() => setShowModal(true)}
                    className='text-white font-bold tracking-wider flex flex-row items-center gap-3 mb-5'
                >
                    <PlusCircle size={20} className="text-white" />
                    Add New item types
                </button>
            </div>
        <section className='w-full flex flex-row'>

            {/* Left side view */}
            <div className='w-2/3 space-y-8 z-10'>

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
                </div>
            </div>

            {/* Right side view */}
            <div className='w-1/3  pl-0 md:pl-12 text-purple-800 pt-1 md:pt-3' >
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
        <AddBillingItemModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onAdd={handleAddItem}
        />
        <AddBillItemToBillModal
            isOpen={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onAdd={handleAddItem}
            billId={billId}
            reservation={reservation}
        />
    </div>
    </AdminPageLayout>
  )
}

export default BillingPage