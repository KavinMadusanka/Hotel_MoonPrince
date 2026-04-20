import React, { useEffect, useState } from 'react'
import Layout from '../../../layouts/Layout';
import { CreditCard, Download } from 'lucide-react';
import { getUserBill } from '../../../apiService/PaymentService';
import { getUserDetails } from '../../../apiService/userService';

const PaymentPage = () => {
  const [bill, setBill] = React.useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    accommodationCharges: 0,
    foodCharges: 0,
    additionalServicesFee: 0,
  });
  const [user, setUser] = React.useState(null);
  const [billDetails, setBillDetails] = React.useState([]);
  const [loading, setLoading] = useState(true);

  const calculateBillSummary = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return ;
    }

    const billingItems = data.flatMap((bill) => bill.billingItems || []);


    let taxRate = 0.1
    let accommodationCharges = 0;
    let foodCharges = 0;
    let additionalServicesFee = 0;

    billingItems.forEach((item) => {
      const itemTotal = (item.QTY || 0) * (item.UnitPrice || 0);

      if (item.ItemType === "Accommodation") {
        accommodationCharges += itemTotal;
      } else if (item.ItemType === "Food & Beverages") {
        foodCharges += itemTotal;
      } else {
        additionalServicesFee += itemTotal;
      }
    });

    const subtotal =
      accommodationCharges + foodCharges + additionalServicesFee;

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      accommodationCharges,
      foodCharges,
      additionalServicesFee,
    };
  };

useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);

        const userDetails = await getUserDetails();
        // console.log("User: ", userDetails.data.user);
        setUser(userDetails.data.user);

        const res = await getUserBill();
        // console.log(res.data.data);
        
        if (res.data.data.length > 0) {
          setBillDetails(res.data.data);
          setBill(calculateBillSummary(res.data.data));
        }

      } catch (error) {
        console.log(error);
        setBillDetails([]);

      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, []);

  // console.log(bill);
  // console.log("Bill Details",billDetails);
  const allBillingItems = billDetails?.flatMap((bill) => bill.billingItems || []) || [];


  return (
    <Layout>
        <div className="max-w-6xl mx-auto p-6 mt-20 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">My Invoice</h1>
            <p className="text-gray-500 text-sm">
              View and manage your recent stay charges and payments
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 text-white px-4 py-2 border rounded-lg hover:bg-gray-100">
              <Download size={16} /> Download PDF
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800">
              <CreditCard size={16} /> Pay Now
            </button>
          </div>
        </div>

        {/* INVOICE CARD */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* TOP */}
          <div className="p-6 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-purple-700">
                Hotel MoonPrince
              </h2>
              <p className="text-sm text-gray-500">123 Royal Crescent, Moon valley, Cloud Kingdom 45902</p>
              <p className="text-sm text-gray-500">info@hotelmoonprince.com</p>
            </div>

            <div className="text-right">
              <span  className={`text-xs px-2 py-1 rounded-full ${
                  bill.total > 0
                    ? "bg-red-100 text-red-500"
                    : "bg-green-100 text-green-600"
                }`}>
                {(bill.total > 0) ? "PAYMENT PENDING" : "ALL SETTLED"}
              </span>
                {/* PAYMENT PENDING */}
              <h2 className="text-xl font-bold text-gray-700 mt-2">
                INVOICE
              </h2>
              {/* <p className="text-sm text-gray-500">#INV-2023-0892</p> */}
            </div>
          </div>

          {/* DETAILS */}
          
            {loading ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-10">
                <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-3">Loading billing details...</p>
              </div>
            ) :  (
              <>
                <div className="grid grid-cols-3 gap-6 bg-gray-50 p-6 text-sm">
                  <div>
                    <p className="text-gray-400">GUEST NAME</p>
                    <p className="font-medium text-black">{user?.name || "Guest"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">ROOM DETAILS</p>
                    {allBillingItems.filter((item) => item.ItemType === "Accommodation").length === 0 ? (
                      <p className="text-sm text-gray-400">No rooms booked</p>
                    ) : (
                      allBillingItems
                        .filter((item) => item.ItemType === "Accommodation")
                        .map((item, index) => (
                          <div key={index} className="border-b py-2">
                            <p className="text-xs font-medium text-black">
                              {item.Description}
                            </p>
                            <p className="text-xs text-gray-400">Qty: {item.QTY}</p>
                          </div>
                        ))
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400">ISSUE DATE</p>
                    {/* <p className="font-medium text-black">{invoice.date}</p> */}
                  </div>
                </div>

                <div className="p-6">
                  {billDetails.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                      <h2 className="text-xl font-semibold text-gray-700">No Billing Records</h2>
                      <p className="text-gray-500 mt-2">
                        You do not have any bills to pay.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="text-gray-400 border-b">
                        <tr>
                          <th className="text-left pb-2">DESCRIPTION</th>
                          <th>QTY</th>
                          <th>UNIT PRICE</th>
                          <th className="text-right">SUBTOTAL</th>
                        </tr>
                      </thead>

                      <tbody>
                        {allBillingItems.map((item, index) => {
                          const sub = item.QTY * item.UnitPrice;

                          return (
                            <tr key={index} className="border-b text-black">
                              <td className="py-4">
                                <p className="font-medium">{item.ItemType}</p>
                                <p className="text-xs text-gray-400">{item.Description}</p>
                              </td>
                              <td className="text-center">{item.QTY}</td>
                              <td className="text-center">LKR {item.UnitPrice.toLocaleString()}</td>
                              <td className="text-right font-medium">
                                LKR {sub.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

          {/* SUMMARY */}
          <div className="flex justify-between p-6 gap-6">

            {/* NOTE */}
            <div className="bg-purple-50 p-4 rounded-xl text-sm text-gray-600 w-1/2">
              <p className="font-semibold text-purple-700 mb-2">
                NOTE FROM MANAGEMENT
              </p>
              <p>
                Thank you for choosing Hotel Moon Princess. Please settle your
                outstanding balance to avoid late fees.
              </p>
            </div>

            {/* TOTAL */}
            <div className="w-1/2 space-y-2 text-sm text-black">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="flex flex-row gap-3">
                  <p>
                    LKR
                  </p>
                  <p>
                    {bill.subtotal.toLocaleString()}
                  </p>
                </span>
              </div>

              <div className="flex justify-between text-black">
                <span>Tax (10%)</span>
                <span className="flex flex-row gap-3">
                  <p>
                    LKR
                  </p>
                  <p>
                    {bill.tax.toLocaleString()}
                  </p>
                </span>
              </div>

              {/* <div className="flex justify-between">
                <span>Service Charge (5%)</span>
                <span>${service.toLocaleString()}</span>
              </div> */}

              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Grand Total</span>
                <span className="text-yellow-500 flex flex-row gap-3">
                  <p>
                    LKR
                  </p>
                  <p>
                  {bill.total.toLocaleString()}
                  </p>
                </span>
              </div>

              <button className="w-full mt-4 bg-purple-700 text-white py-3 rounded-xl hover:bg-purple-800 flex flex-row gap-3 justify-center items-center">
                <p className="relative flex flex-row gap-10">
                  <p>
                    Pay Total 
                  </p>
                  <p>
                    LKR
                  </p>
                </p>
                <p>
                  {bill.total.toLocaleString()}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* EXTRA CARDS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold text-black">Stay History</h3>
            <p className="text-sm text-gray-500">
              You've stayed with us 4 times this year.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold text-black">Billing Inquiry?</h3>
            <p className="text-sm text-gray-500">
              Questions about your charges? We're here to help.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PaymentPage