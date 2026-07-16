import React, { useState } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    ChevronDown,
    Search,
    Menu,
    X
} from 'lucide-react';
import Navbar from './Navbar.jsx';

export default function PatientBills() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dynamic dashboard summary card statistics directly from the image
    const cardStats = [
        {
            title: 'Total Medical Expenses',
            value: 'Rs. 25,458',
            titleColor: '#00A3C4',
            valueColor: '#065AD8'
        },
        {
            title: 'Pending Payments',
            value: 'Rs. 2,500',
            titleColor: '#D32F2F',
            valueColor: '#D32F2F'
        },
        {
            title: 'Paid Bills',
            value: '18 Bills',
            titleColor: '#2E7D32',
            valueColor: '#2E7D32'
        },
        {
            title: 'Insurance Covered',
            value: 'Rs. 8,000',
            titleColor: '#00A3C4',
            valueColor: '#00A3C4'
        }
    ];

    // Raw dataset representing rows inside the document table
    const billsData = [
        { id: '#INV-1245', date: '12 July 2026', category: 'Consultation', department: 'Cardiology', amount: 'Rs. 500', status: 'Paid' },
        { id: '#INV-1245', date: '12 July 2026', category: 'Laboratory', department: 'Pharmacist', amount: 'Rs. 1200', status: 'Unpaid' },
        { id: '#INV-1245', date: '12 July 2026', category: 'Medicines', department: 'Pharmacist', amount: 'Rs. 1200', status: 'Unpaid' },
        { id: '#INV-1245', date: '12 July 2026', category: 'Medicines', department: 'Cardiology', amount: 'Rs. 500', status: 'Paid' },
        { id: '#INV-1245', date: '12 July 2026', category: 'Laboratory', department: 'Cardiology', amount: 'Rs. 500', status: 'Paid' }
    ];

    const tabs = ['All', 'Consultation', 'Laboratory', 'Medicines', 'Unpaid'];

    // Filter items dynamically based on active tab select state & search query input string
    const filteredBills = billsData.filter(bill => {
        const matchesTab = activeTab === 'All'
            ? true
            : activeTab === 'Unpaid'
                ? bill.status === 'Unpaid'
                : bill.category === activeTab;

        const matchesSearch =
            bill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.id.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">

            <Navbar />

            {/* 2. Main Content Layout Container */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">

                <div className="flex-1">
                    {/* Header Dashboard Section Heading */}
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                            Bills & Receipts
                        </h1>
                    </div>

                    {/* Grid Layout Container for the four analytic metric cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {cardStats.map((card, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow transition-shadow flex flex-col justify-between min-h-[125px]">
                                <span className="font-bold text-sm sm:text-base leading-tight" style={{ color: card.titleColor }}>
                                    {card.title}
                                </span>
                                <span className="text-2xl sm:text-3xl font-black mt-2 tracking-tight" style={{ color: card.valueColor }}>
                                    {card.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* 3. Search Bar Filter Mechanism Container */}
                    <div className="bg-white rounded-lg border border-gray-300 px-4 py-2.5 flex items-center space-x-3 mb-6 shadow-sm max-w-full">
                        <Search className="w-5 h-5 text-gray-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Invoice by category/department/status"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-sm outline-none text-gray-700 placeholder-gray-400 font-medium bg-transparent"
                        />
                    </div>

                    {/* 4. Categorized Filtering Navigation Items */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-3 mb-6 scrollbar-none w-full">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl font-bold text-xs sm:text-sm border whitespace-nowrap transition-all ${isActive
                                            ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                                            : 'bg-white text-[#00B4D8] border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    {/* 5. Accounts/Invoices Structured Data Grid/Table Layout */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full mb-8">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[850px] lg:min-w-0">
                                <thead>
                                    <tr className="bg-[#0487BD] text-white text-center font-bold text-xs sm:text-sm">
                                        <th className="py-4 px-6">Invoice ID</th>
                                        <th className="py-4 px-6">Bill date</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6">Department</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                        <th className="py-4 px-6 text-center">View Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#BCE1EC]">
                                    {filteredBills.length > 0 ? (
                                        filteredBills.map((bill, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 text-center transition-colors text-sm sm:text-base">
                                                <td className="py-5 px-6 font-bold text-gray-800 whitespace-nowrap">
                                                    {bill.id}
                                                </td>
                                                <td className="py-5 px-6 font-semibold text-gray-700 whitespace-nowrap">
                                                    {bill.date}
                                                </td>
                                                <td className="py-5 px-6 font-bold text-gray-800">
                                                    {bill.category}
                                                </td>
                                                <td className="py-5 px-6 font-bold text-gray-800">
                                                    {bill.department}
                                                </td>
                                                <td className="py-5 px-6 font-bold text-gray-800 whitespace-nowrap">
                                                    {bill.amount}
                                                </td>
                                                <td className="py-5 px-6 text-center whitespace-nowrap">
                                                    <span className={`font-bold text-sm ${bill.status === 'Paid' ? 'text-[#2E7D32]' : 'text-[#D32F2F]'
                                                        }`}>
                                                        {bill.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-center whitespace-nowrap">
                                                    {bill.status === 'Paid' ? (
                                                        <button className="bg-[#00B4D8] hover:bg-[#0096B4] text-white font-bold text-xs sm:text-sm py-1.5 px-6 rounded-lg shadow-sm transition-colors min-w-[80px]">
                                                            View
                                                        </button>
                                                    ) : (
                                                        <button className="bg-[#1B5E20] hover:bg-[#123C15] text-white font-bold text-xs sm:text-sm py-1.5 px-6 rounded-lg shadow-sm transition-colors min-w-[80px]">
                                                            Pay
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-10 text-center text-sm font-medium text-gray-400">
                                                No invoices found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}