import React, { useState, useEffect } from 'react';
import {
    SquarePlus,
    Bell,
    User,
    ChevronDown,
    Search,
    Menu,
    X,
    Loader2,
    Eye,
    CreditCard,
    Download,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { FileText } from 'lucide-react';
import Navbar from './Navbar.jsx';
import { billService } from '../services/PatientBillService.js';

export default function PatientBills() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [bills, setBills] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    const tabs = ['All', 'Consultation', 'Laboratory', 'Medicines', 'Unpaid'];

    useEffect(() => {
        fetchBills();
        fetchStats();
    }, []);

    const fetchBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await billService.getMyBills();
            // console.log('Bills response:', response);
            if (response.success) {
                setBills(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching bills:', error);
            setError(error.message || 'Failed to load bills');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await billService.getBillStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 5000);
    };

    // Filter bills based on tab and search
    const filteredBills = bills.filter(bill => {
        const matchesTab = activeTab === 'All'
            ? true
            : activeTab === 'Unpaid'
                ? bill.status === 'Unpaid'
                : bill.category === activeTab;

        const matchesSearch =
            bill.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.billId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bill.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Open payment modal
    const handleOpenPayment = (billId) => {
        setSelectedBillId(billId);
        setShowPaymentModal(true);
    };

    // Process payment
    const handleProcessPayment = async () => {
        if (!selectedBillId) return;
        
        try {
            setPaymentProcessing(true);
            // console.log('Processing payment for bill:', selectedBillId);
            
            const response = await billService.payBill(selectedBillId, paymentMethod);
            // console.log('Payment response:', response);
            
            if (response.success) {
                showNotification('success', 'Bill paid successfully!');
                setShowPaymentModal(false);
                setSelectedBillId(null);
                await fetchBills();
                await fetchStats();
            } else {
                showNotification('error', response.message || 'Failed to pay bill');
            }
        } catch (error) {
            console.error('Error paying bill:', error);
            showNotification('error', error.message || 'Failed to pay bill');
        } finally {
            setPaymentProcessing(false);
        }
    };

    // View bill details
    const handleViewBill = async (billId) => {
        try {
            // console.log('Viewing bill/order ID:', billId);
            const response = await billService.getBillDetails(billId);
            if (response.success) {
                const bill = response.data;
                // console.log('Bill details:', bill);

                const items = bill.items || [];
                const itemList = items.map(item =>
                    `${item.medicineName || item.name} x${item.quantity} = ₹${((item.price || 0) * (item.quantity || 0) || item.total || 0).toFixed(2)}`
                ).join('\n');

                alert(
                    `Bill Details\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Bill ID: ${bill.billId || bill.orderId || 'N/A'}\n` +
                    `Date: ${bill.date || new Date(bill.createdAt).toLocaleDateString()}\n` +
                    `Amount: ₹${(bill.totalAmount || bill.amountRaw || 0).toFixed(2)}\n` +
                    `Status: ${bill.paymentStatus || bill.status || 'Unpaid'}\n` +
                    `Patient: ${bill.patientName || 'N/A'}\n` +
                    `Doctor: ${bill.doctorName || 'N/A'}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Items:\n${itemList || 'No items'}\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━`
                );
            }
        } catch (error) {
            console.error('Error viewing bill:', error);
            showNotification('error', error.message || 'Failed to load bill details');
        }
    };

    const handleDownloadBill = async (billId) => {
        try {
            // console.log('Downloading bill:', billId);
            
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to download bills');
                return;
            }

            // Open in new tab - simple like appointments
            const downloadUrl = `http://localhost:5000/api/bills/${billId}/download`;
            window.open(downloadUrl, '_blank');
            
            showNotification('success', 'Bill opened in new tab!');
            
        } catch (error) {
            console.error('Error downloading bill:', error);
            showNotification('error', 'Failed to download bill');
        }
    };

    // Card stats from backend
    const cardStats = [
        {
            title: 'Total Medical Expenses',
            value: stats ? `Rs. ${stats.totalMedicalExpenses?.toFixed(0) || 0}` : 'Rs. 0',
            titleColor: '#00A3C4',
            valueColor: '#065AD8'
        },
        {
            title: 'Pending Payments',
            value: stats ? `Rs. ${stats.pendingPayments?.toFixed(0) || 0}` : 'Rs. 0',
            titleColor: '#D32F2F',
            valueColor: '#D32F2F'
        },
        {
            title: 'Paid Bills',
            value: stats ? `${stats.paidBills || 0} Bills` : '0 Bills',
            titleColor: '#2E7D32',
            valueColor: '#2E7D32'
        },
        {
            title: 'Insurance Covered',
            value: stats ? `Rs. ${stats.insuranceCovered?.toFixed(0) || 0}` : 'Rs. 0',
            titleColor: '#00A3C4',
            valueColor: '#00A3C4'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F6FA]">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-[#00b4d8] animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading your bills...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#F0F6FA] font-sans antialiased flex flex-col">

            <Navbar />

            {/* Notification */}
            {notification.message && (
                <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-500" />
                                Payment Details
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedBillId(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm font-medium text-blue-800">Payment Method</p>
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {['Cash', 'Card', 'UPI'].map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`p-3 rounded-lg border-2 text-center transition ${paymentMethod === method
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-xl">
                                                {method === 'Cash' && '💵'}
                                                {method === 'Card' && '💳'}
                                                {method === 'UPI' && '📱'}
                                            </div>
                                            <p className="text-xs font-medium mt-1">{method}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleProcessPayment}
                                disabled={paymentProcessing}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {paymentProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Confirm Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

                    {/* Search Bar Filter Mechanism Container */}
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

                    {/* Categorized Filtering Navigation Items */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-3 mb-6 scrollbar-none w-full">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            const count = tab === 'All' ? bills.length :
                                tab === 'Unpaid' ? bills.filter(b => b.status === 'Unpaid').length :
                                    bills.filter(b => b.category === tab).length;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-xl font-bold text-xs sm:text-sm border whitespace-nowrap transition-all flex items-center gap-2 ${isActive
                                            ? 'bg-[#00B4D8] text-white border-[#00B4D8]'
                                            : 'bg-white text-[#00B4D8] border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                    {count > 0 && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Accounts/Invoices Structured Data Grid/Table Layout */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full mb-8">
                        {filteredBills.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg">No bills found</p>
                                <p className="text-gray-400 text-sm mt-2">No bills match your current filters</p>
                            </div>
                        ) : (
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
                                            <th className="py-4 px-6 text-center" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#BCE1EC]">
                                        {filteredBills.map((bill, idx) => {
                                            const isPaid = bill.status === 'Paid' || bill.paymentStatus === 'Paid';
                                            
                                            return (
                                                <tr key={bill._id || idx} className="hover:bg-slate-50 text-center transition-colors text-sm sm:text-base">
                                                    <td className="py-5 px-6 font-bold text-gray-800 whitespace-nowrap">
                                                        {bill.billId || bill.invoiceId || 'N/A'}
                                                    </td>
                                                    <td className="py-5 px-6 font-semibold text-gray-700 whitespace-nowrap">
                                                        {bill.date || 'N/A'}
                                                    </td>
                                                    <td className="py-5 px-6 font-bold text-gray-800">
                                                        {bill.category || 'Other'}
                                                    </td>
                                                    <td className="py-5 px-6 font-bold text-gray-800">
                                                        {bill.department || 'General'}
                                                    </td>
                                                    <td className="py-5 px-6 font-bold text-gray-800 whitespace-nowrap">
                                                        {bill.amount || `Rs. ${(bill.totalAmount || bill.amountRaw || 0).toFixed(2)}`}
                                                    </td>
                                                    <td className="py-5 px-6 text-center whitespace-nowrap">
                                                        <span className={`font-bold text-sm ${isPaid ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                                                            {isPaid ? '✅ Paid' : '⚠️ Unpaid'}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6 text-center whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleViewBill(bill._id)}
                                                            className="bg-[#00B4D8] hover:bg-[#0096B4] text-white font-bold text-xs sm:text-sm py-1.5 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-1 mx-auto"
                                                            title="View Bill Details"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            <span>View</span>
                                                        </button>
                                                    </td>
                                                    <td className="py-5 px-6 text-center whitespace-nowrap">
                                                        {isPaid ? (
                                                            <button
                                                                onClick={() => handleDownloadBill(bill._id)}
                                                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm py-1.5 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-1 mx-auto"
                                                                title="Download Bill"
                                                            >
                                                                <Download className="w-3 h-3" />
                                                                <span>Download</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenPayment(bill._id)}
                                                                disabled={actionLoading === bill._id}
                                                                className="bg-[#1B5E20] hover:bg-[#123C15] text-white font-bold text-xs sm:text-sm py-1.5 px-6 rounded-lg shadow-sm transition-colors min-w-[80px] disabled:opacity-50"
                                                                title="Pay Bill"
                                                            >
                                                                {actionLoading === bill._id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                                ) : (
                                                                    'Pay'
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}