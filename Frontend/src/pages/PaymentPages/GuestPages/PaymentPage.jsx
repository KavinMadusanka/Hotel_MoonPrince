import React, { useEffect } from 'react'
import Layout from '../../../layouts/Layout';
import { CreditCard, Download } from 'lucide-react';
import { getUserBill } from '../../../apiService/PaymentService';

const PaymentPage = () => {
  const invoice = {
    guest: "Serenity Tsukino",
    room: "702 - Royal Suite",
    date: "October 24, 2023",

    items: [
      {
        name: "Royal Suite - 3 Nights",
        desc: "Luxury Accommodation",
        qty: 1,
        price: 850,
      },
      {
        name: "In-Room Dining (Dinner)",
        desc: "Signature Lunar Seafood Platter",
        qty: 2,
        price: 75,
      },
      {
        name: "Spa Treatment - Lunar Glow",
        desc: "Full Body Therapy & Steam",
        qty: 1,
        price: 220,
      },
    ],
  };
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await getUserBill();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBill();
  }, []);



  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const tax = subtotal * 0.10;
  const service = subtotal * 0.05;
  const total = subtotal + tax + service;
  
  return (
    <Layout>
        <div className="max-w-6xl mx-auto p-6 mt-20 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-black">My Invoice</h1>
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
              <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                PAYMENT PENDING
              </span>
              <h2 className="text-xl font-bold text-gray-700 mt-2">
                INVOICE
              </h2>
              <p className="text-sm text-gray-500">#INV-2023-0892</p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-3 gap-6 bg-gray-50 p-6 text-sm">
            <div>
              <p className="text-gray-400">GUEST NAME</p>
              <p className="font-medium text-black">{invoice.guest}</p>
            </div>

            <div>
              <p className="text-gray-400">ROOM DETAILS</p>
              <p className="font-medium text-black">{invoice.room}</p>
            </div>

            <div>
              <p className="text-gray-400">ISSUE DATE</p>
              <p className="font-medium text-black">{invoice.date}</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="p-6">
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
                {invoice.items.map((item, index) => {
                  const sub = item.qty * item.price;

                  return (
                    <tr key={index} className="border-b text-black">
                      <td className="py-4">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-center">${item.price}</td>
                      <td className="text-right font-medium">
                        ${sub.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
            <div className="w-1/2 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Charge (5%)</span>
                <span>${service.toLocaleString()}</span>
              </div>

              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Grand Total</span>
                <span className="text-yellow-500">
                  ${total.toLocaleString()}
                </span>
              </div>

              <button className="w-full mt-4 bg-purple-700 text-white py-3 rounded-xl hover:bg-purple-800">
                Pay Total ${total.toLocaleString()}
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