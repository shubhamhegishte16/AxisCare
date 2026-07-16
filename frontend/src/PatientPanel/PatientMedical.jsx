import React, { useState, useMemo, useRef } from 'react';
import Navbar from './Navbar';
import { Search } from 'lucide-react';

const VITALS_DATA = [
    { id: 1, label: 'Heart Rate', value: '70 bpm', color: 'text-teal-500', icon: 'heart-rate' },
    { id: 2, label: 'Cholesterol', value: '180 mg/dL', color: 'text-emerald-500', icon: 'cholesterol' },
    { id: 3, label: 'Haemoglobin', value: '14 g/dL', color: 'text-red-500', icon: 'hemoglobin' },
    { id: 4, label: 'Blood Pressure', value: '120/80 mm Hg', color: 'text-rose-500', icon: 'blood-pressure' },
    { id: 5, label: 'Glucose', value: '110 mg/dL', color: 'text-amber-500', icon: 'glucose' },
    { id: 6, label: 'White Blood', value: '6,000/mm3', color: 'text-blue-500', icon: 'white-blood' },
    { id: 7, label: 'Body Mass Index', value: '175 lbs', color: 'text-indigo-500', icon: 'bmi' },
    { id: 8, label: 'Respiratory', value: '16 b/m', color: 'text-sky-500', icon: 'respiratory' },
    { id: 9, label: 'Platelet Count', value: '250,000/mm3', color: 'text-purple-500', icon: 'platelets' },
];

const ALL_VISITS_DATA = [
    { visitId: '#MH-1045', date: 'July 01, 2026', department: 'Cardiology', doctor: 'Dr. Ramesh Kumar', reason: 'Hypertension', status: 'Completed' },
    { visitId: '#MH-1245', date: 'July 10, 2026', department: 'Follow Up', doctor: 'Dr. Ramesh Kumar', reason: 'Hypertension', status: 'Rescheduled' },
    { visitId: '#MH-1345', date: 'July 12, 2026', department: 'Follow Up', doctor: 'Dr. Ramesh Kumar', reason: 'Hypertension', status: 'Cancelled' },
];

const CONSULTATION_DATA = [
    { doctor: 'Dr. Rahul Sharma', visitDate: 'July 01, 2026', symptoms: 'Persistent headaches, dizziness', notes: 'Patient to monitor BP twice daily at home. Restrict dietary sodium.', department: 'Cardiology', followUp: '26 July 2026' },
    { doctor: 'Dr. Rahul Sharma', visitDate: 'July 01, 2026', symptoms: 'Persistent headaches, dizziness', notes: 'Patient to monitor BP twice daily at home. Restrict dietary sodium.', department: 'Cardiology', followUp: '26 July 2026' }
];

const LAB_TESTS_DATA = [
    { patientId: '#MH-1245', testName: 'CBC', category: 'Hematology', requestedBy: 'Dr. Rahul Sharma', status: 'Completed', date: '26 July 2026' },
    { patientId: '#MH-1245', testName: 'Lipid Profile', category: 'Biochemistry', requestedBy: 'Dr. Rahul Sharma', status: 'Completed', date: '13 July 2026' },
    { patientId: '#MH-1245', testName: 'Urine Routine', category: 'Urinalysis', requestedBy: 'Dr. Rahul Sharma', status: 'Pending', date: '13 July 2026' },
];

const MEDICATIONS_DATA = [
    { patientId: '#MH-1245', medicine: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice Daily', duration: '5 Days', status: 'Purchased' },
    { patientId: '#MH-1245', medicine: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once Daily', duration: '30 Days', status: 'Purchased' },
    { patientId: '#MH-1245', medicine: 'Vitamin D3 60K', dosage: '1 capsule', frequency: 'Weekly', duration: '4 weeks', status: 'Not Purchased' },
];

const VitalsIcon = ({ type }) => {
    switch (type) {
        case 'heart-rate':
            return (
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case 'cholesterol':
            return (
                <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" className="opacity-20" />
                    <circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="16" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        case 'hemoglobin':
            return (
                <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C12 2 6 8 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8 12 2 12 2Z" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="10" cy="11" r="1" fill="currentColor" />
                    <circle cx="14" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="11" cy="15" r="1" fill="currentColor" />
                </svg>
            );
        case 'blood-pressure':
            return (
                <svg className="w-10 h-10 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="currentColor" fillOpacity="0.1" />
                    <path d="M12 6V12L15 15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            );
        case 'glucose':
            return (
                <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="6" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.3" />
                    <rect x="12" y="12" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.7" />
                </svg>
            );
        case 'white-blood':
            return (
                <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
            );
        case 'bmi':
            return (
                <svg className="w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 18V20H21V18H16Z" fill="currentColor" />
                    <rect x="4" y="4" width="8" height="16" rx="1" />
                    <circle cx="17" cy="8" r="2" />
                    <path d="M15 13H19V15H15V13Z" />
                </svg>
            );
        case 'respiratory':
            return (
                <svg className="w-10 h-10 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12C9 7.5 11 5 11 5M15 12C15 7.5 13 5 13 5M6 18C6 14 9 13 9 13M18 18C18 14 15 13 15 13" strokeLinecap="round" />
                </svg>
            );
        case 'platelets':
            return (
                <svg className="w-10 h-10 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="3" fill="currentColor" fillOpacity="0.2" />
                    <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.4" />
                    <circle cx="16" cy="7" r="2" fill="currentColor" />
                </svg>
            );
        default:
            return null;
    }
};

export default function PatientMedical() {
    const [activeTab, setActiveTab] = useState('All Visits');
    const [searchQuery, setSearchQuery] = useState('');

    const searchSectionRef = useRef(null);
    const searchInputRef = useRef(null);

    const tabs = ['All Visits', 'Consultation', 'Lab Tests', 'Medications'];

    const handleScrollToSearch = () => {
        if (searchSectionRef.current) {
            searchSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 400);
        }
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Completed':
            case 'Purchased':
                return 'text-emerald-600 font-bold';
            case 'Rescheduled':
            case 'Pending':
                return 'text-amber-500 font-bold';
            case 'Cancelled':
            case 'Not Purchased':
                return 'text-red-600 font-bold';
            default:
                return 'text-slate-600 font-medium';
        }
    };

    const getFilteredData = useMemo(() => {
        switch (activeTab) {
            case 'All Visits':
                return ALL_VISITS_DATA.filter(row =>
                    row.doctor.toLowerCase().includes(searchQuery) ||
                    row.reason.toLowerCase().includes(searchQuery) ||
                    row.date.toLowerCase().includes(searchQuery)
                );
            case 'Consultation':
                return CONSULTATION_DATA.filter(row =>
                    row.doctor.toLowerCase().includes(searchQuery) ||
                    row.symptoms.toLowerCase().includes(searchQuery) ||
                    row.visitDate.toLowerCase().includes(searchQuery)
                );
            case 'Lab Tests':
                return LAB_TESTS_DATA.filter(row =>
                    row.testName.toLowerCase().includes(searchQuery) ||
                    row.category.toLowerCase().includes(searchQuery) ||
                    row.requestedBy.toLowerCase().includes(searchQuery)
                );
            case 'Medications':
                return MEDICATIONS_DATA.filter(row =>
                    row.medicine.toLowerCase().includes(searchQuery) ||
                    row.status.toLowerCase().includes(searchQuery)
                );
            default:
                return [];
        }
    }, [activeTab, searchQuery]);

    return (
        <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800">
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-between">

                {/* Title Area */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                        My Medical History
                    </h1>
                    <button
                        onClick={handleScrollToSearch}
                        className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-[#00b4d8] transition-all hover:shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Vitals Section */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100/80 p-4 sm:p-8 shadow-sm mb-8 sm:mb-10 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-2 border-b border-slate-50 sm:border-none">
                        <span className="text-[12px] font-semibold text-blue-500 uppercase tracking-wider sm:absolute sm:top-4 sm:right-8">
                            Last Check-up: July 10, 2026
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {VITALS_DATA.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
                            >
                                <div>
                                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1">{item.label}</p>
                                    <p className={`text-lg sm:text-xl font-bold tracking-tight ${item.color}`}>{item.value}</p>
                                </div>
                                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 shrink-0">
                                    <VitalsIcon type={item.icon} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter & Search Area */}
                <div ref={searchSectionRef} className="flex flex-col items-center mb-6 sm:mb-8 w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">

                    {/* Search bar */}
                    <div className="relative w-full">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by Doctor/Diagnosis/Date"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00b4d8] focus:ring-1 focus:ring-[#00b4d8] text-sm text-slate-700 placeholder-slate-400 transition-all shadow-sm"
                        />
                        <span className="absolute left-4 top-3.5 text-slate-400">
                            <Search size={18}/>
                        </span>
                    </div>

                    {/* Tabs Filter pills (Responsive Horizontal Scroll) */}
                    <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-none flex justify-start md:justify-center px-1">
                        <div className="flex space-x-2 sm:space-x-3 whitespace-nowrap">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                                        className={`px-5 sm:px-8 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all shrink-0 ${isActive
                                            ? 'bg-[#00b4d8] text-white shadow-sm shadow-cyan-200'
                                            : 'bg-white border border-[#00b4d8]/40 text-[#00b4d8] hover:bg-[#00b4d8]/5'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Dynamic Data Table Block */}
                <div className="bg-white border rounded-xl sm:rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-center border-collapse min-w-[700px] md:min-w-full">
                            <thead>
                                <tr className="bg-[#0092b3] text-white text-[12px] sm:text-[13px] font-bold uppercase tracking-wider h-12">
                                    {activeTab === 'All Visits' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">VisitId</th>
                                            <th className="py-3 px-4 sm:px-6">Date</th>
                                            <th className="py-3 px-4 sm:px-6">Department</th>
                                            <th className="py-3 px-4 sm:px-6">Doctor</th>
                                            <th className="py-3 px-4 sm:px-6">Reason</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Details</th>
                                        </>
                                    )}
                                    {activeTab === 'Consultation' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Doctor</th>
                                            <th className="py-3 px-4 sm:px-6">Visit Date</th>
                                            <th className="py-3 px-4 sm:px-6">Symptoms</th>
                                            <th className="py-3 px-4 sm:px-6">Doctor Notes</th>
                                            <th className="py-3 px-4 sm:px-6">Department</th>
                                            <th className="py-3 px-4 sm:px-6">Follow-up Date</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">Prescriptions</th>
                                        </>
                                    )}
                                    {activeTab === 'Lab Tests' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Patient ID</th>
                                            <th className="py-3 px-4 sm:px-6">Test Name</th>
                                            <th className="py-3 px-4 sm:px-6">Category</th>
                                            <th className="py-3 px-4 sm:px-6">Requested By</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6">Generated Date</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Reports</th>
                                        </>
                                    )}
                                    {activeTab === 'Medications' && (
                                        <>
                                            <th className="py-3 px-4 sm:px-6">Patient ID</th>
                                            <th className="py-3 px-4 sm:px-6">Medicine</th>
                                            <th className="py-3 px-4 sm:px-6">Dosage</th>
                                            <th className="py-3 px-4 sm:px-6">Frequency</th>
                                            <th className="py-3 px-4 sm:px-6">Duration</th>
                                            <th className="py-3 px-4 sm:px-6">Status</th>
                                            <th className="py-3 px-4 sm:px-6 text-right">View Bill</th>
                                        </>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                                {getFilteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="100%" className="py-12 text-center text-slate-400 font-medium">
                                            No matching records found.
                                        </td>
                                    </tr>
                                ) : (
                                    getFilteredData.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            {activeTab === 'All Visits' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">{row.visitId}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.date}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.department}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">{row.doctor}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.reason}</td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColorClass(row.status)}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button className="bg-[#00b4d8] text-white hover:bg-[#0092b3] px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                                            View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Consultation' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">{row.doctor}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.visitDate}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600 max-w-xs truncate">{row.symptoms}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs leading-relaxed max-w-xs truncate">{row.notes}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.department}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.followUp}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button className="bg-[#00b4d8] text-white hover:bg-[#0092b3] px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                                            View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Lab Tests' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">{row.patientId}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-800 font-bold">{row.testName}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.category}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700 font-semibold">{row.requestedBy}</td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={getStatusColorClass(row.status)}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.date}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${row.status === 'Pending'
                                                            ? 'bg-[#9ae5f4] text-white cursor-not-allowed'
                                                            : 'bg-[#00b4d8] text-white hover:bg-[#0092b3]'
                                                            }`}>
                                                            View
                                                        </button>
                                                    </td>
                                                </>
                                            )}

                                            {activeTab === 'Medications' && (
                                                <>
                                                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">{row.patientId}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-800 font-bold">{row.medicine}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-700">{row.dosage}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.frequency}</td>
                                                    <td className="py-4 px-4 sm:px-6 text-slate-600">{row.duration}</td>
                                                    <td className="py-4 px-4 sm:px-6">
                                                        <span className={getStatusColorClass(row.status)}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 sm:px-6 text-right">
                                                        <button className="bg-[#00b4d8] text-white hover:bg-[#0092b3] px-4 py-1.5 rounded-lg text-xs font-bold transition-all">
                                                            View
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}