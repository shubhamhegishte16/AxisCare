import React from 'react';
import Navbar from './Navbar';
import {
    Calendar, FileText, Download, ArrowRight, Send,
    CheckCircle2, Heart, Activity, Droplets, TrendingUp, X,
    Siren,
    Pill
} from 'lucide-react';

export default function PatientDashboard() {
    return (
        <div className="min-h-screen w-full bg-[#f0f5fa] font-sans antialiased text-[#0f4c81] flex flex-col">

            {/* Reusable Header Element */}
            <Navbar />

            {/* Main content expands fluidly to full width of any high-res display */}
            <main className="flex-1 w-full px-4 sm:px-8 py-6 space-y-6">

                {/* Hero Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]">
                        Welcome Back, Jonathon S. <span className="font-normal text-gray-400 text-base sm:text-xl md:border-l-2 md:border-gray-300 md:pl-3 block md:inline mt-1 md:mt-0">Monday, July 13, 2026</span>
                    </h1>
                    <button className="bg-[#00b4d8] hover:bg-[#0096b4] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition shadow-sm self-stretch sm:self-auto text-center">
                        Book Appointment
                    </button>
                </div>

                {/* Immediate Actions & Alerts */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-red-500 font-bold text-lg mb-4">Immediate Actions & Alerts</h2>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-red-50/40 rounded-xl border border-red-100/30">
                            <div className="flex items-start gap-3">
                                <div className="text-red-500 mt-0.5 bg-red-50 p-2 rounded-lg"><Siren size={20} /></div>
                                <p className="font-semibold text-sm text-[#0f4c81]">
                                    <span className="text-red-500 font-bold">URGENT:</span> You have an outstanding balance of $120.00 due in 3 days.
                                </p>
                            </div>
                            <button className="bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold px-5 py-2 rounded-lg shrink-0 w-full md:w-auto text-center">
                                Pay Invoice
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-blue-50/20 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                <p className="font-semibold text-sm text-[#0f4c81]">
                                    <span className="text-blue-600 font-bold">NEXT VISIT:</span> Dr. Sarah Jenkins | Tomorrow at 10:00 AM (Clinic Room 3B)
                                </p>
                            </div>
                            <button className="bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold px-5 py-2 rounded-lg shrink-0 w-full md:w-auto text-center">
                                Get Directions
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Health Snapshot Dashboard Panels */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-[#0f4c81] font-bold text-lg mb-6">My health at a glance</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Health Summary Sub-card */}
                        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-[#0f4c81]">Health Summary</h3>
                                </div>

                                <div className="space-y-3 text-xs mb-4">
                                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg">
                                        <span className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Heart className="w-4 h-4 text-red-400 fill-current" /> Blood Pressure: 120/80 mmHg
                                        </span>
                                        <span className="text-blue-500 font-medium">[Normal]</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg">
                                        <span className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Activity className="w-4 h-4 text-red-500" /> Heart Rate: 72 BPM
                                        </span>
                                        <span className="text-blue-500 font-medium">[Optimal]</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg">
                                        <span className="flex items-center gap-2 text-blue-600 font-medium">
                                            <Droplets className="w-4 h-4 text-blue-400" /> Blood Sugar: 95 mg/L
                                        </span>
                                        <span className="text-blue-500 font-medium">[Fasting]</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-50">
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                <div className="bg-[#00b4d8] text-white text-[10px] px-4 py-1 rounded-full font-medium">
                                    mini sparline trend graph
                                </div>
                            </div>
                        </div>

                        {/* Latest Prescriptions Sub-card */}
                        <div className="border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-[#0f4c81]">Latest Prescriptions</h3>
                                </div>

                                <div className="flex justify-between text-xs font-semibold text-blue-600 mb-3">
                                    <span>Dr. Sarah Jekins</span>
                                    <span className="text-gray-400 font-normal">Issued on: July 01, 2026</span>
                                </div>

                                <div className="space-y-2 text-xs text-blue-900 font-medium">
                                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                                        <span className='flex gap-2'><Pill /> Amoxicillin 500mg</span>
                                        <span className="text-gray-400 font-normal">(1 cap, 3x daily)</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg">
                                        <span className='flex gap-2'><Pill /> Lisinopril 10mg</span>
                                        <span className="text-gray-400 font-normal">(1 tab, daily)</span>
                                    </div>
                                </div>
                            </div>

                            <button className="bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold py-2 px-6 rounded-lg mt-4 w-full sm:w-2/3 mx-auto flex items-center justify-center gap-1">
                                Download Pdf
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Multicolumn adaptive content module */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Upcoming Appointments */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-base text-blue-900">Upcoming Appointments</h3>
                            </div>
                            <h4 className="text-xs font-bold text-blue-600 mb-4">Dr. Sarah Jekins [cardiologist]</h4>
                            <div className="space-y-2.5 text-xs text-blue-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span>Tomorrow, July 14 at 10:00 AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-bold text-base leading-none">+</span>
                                    <span>Clinic Room 3B</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <button className="bg-[#00b4d8] text-white text-[10px] font-bold py-1.5 px-3 rounded-lg flex-1 text-center">
                                Get Directions
                            </button>
                            <button className="text-red-500 p-1 hover:bg-red-50 rounded-lg transition">
                            </button>
                            <button className="border border-blue-400 text-blue-600 text-[10px] font-bold py-1.5 px-3 rounded-lg flex-1 text-center bg-white">
                                Reschedule
                            </button>
                        </div>
                    </div>

                    {/* Pending Bills */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-base text-blue-900">Pending Bills</h3>
                            </div>
                            <div className="space-y-2 text-xs font-semibold">
                                <div className="flex justify-between">
                                    <span className="text-blue-500">Invoice:</span>
                                    <span className="text-blue-900 font-bold">#INV-2026-89</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-500">Due:</span>
                                    <span className="text-blue-600 font-bold">In 3 Days</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                                    <span className="text-blue-500">Total:</span>
                                    <span className="text-blue-900 font-bold">$120.00</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-[#00b4d8] hover:bg-[#0096b4] text-white text-xs font-bold py-2 rounded-lg w-full sm:w-2/3 mx-auto mt-4 text-center">
                            Pay Now
                        </button>
                    </div>

                    {/* Cashless Insurance Promo Panel */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden min-h-[160px] md:col-span-2 lg:col-span-1">
                        <div className="z-10">
                            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">Axis Care + Hospitals</span>
                            <h3 className="text-xl font-black text-purple-900 leading-tight tracking-tight">CASHLESS<br />INSURANCE</h3>
                        </div>
                        <div className="absolute right-2 bottom-2 w-36 h-24 bg-white/60 rounded-xl border border-purple-100/40 p-2 flex items-center justify-center text-center text-[10px] text-gray-400 shadow-inner">
                            [ Insurance Vector Illustration ]
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Lower Grid (Marketing & Document Tables) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-b from-teal-50 to-emerald-50 p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-between text-center min-h-[260px]">
                        <div className="text-sm font-bold text-teal-800 flex items-center gap-1">🛡️ Health</div>
                        <div className="w-full bg-white/70 p-3 rounded-xl border border-teal-100 text-[10px] space-y-2 text-gray-500 shadow-sm my-2">
                            <div className="font-bold text-teal-900">CHOOSE A LIFE INSURANCE...</div>
                            <div className="bg-white p-1 rounded border border-gray-100">To get financial cover for income loss</div>
                            <div className="bg-white p-1 rounded border border-gray-100">To manage retirement</div>
                        </div>
                        <div className="w-full bg-white/70 p-3 rounded-xl border border-teal-100 text-[10px] space-y-2 text-gray-500 shadow-sm">
                            <div className="font-bold text-teal-900">CHOOSE A HEALTH PLAN...</div>
                            <div className="bg-white p-1 rounded border border-gray-100">To meet medical emergencies</div>
                        </div>
                    </div>

                    {/* Recent Lab Reports Data Matrix */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-between overflow-x-auto">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-base text-blue-900">Recent Lab Reports</h3>
                            </div>
                            <div className="border border-cyan-100 rounded-xl overflow-hidden text-xs min-w-[500px]">
                                <div className="grid grid-cols-4 bg-[#a2d2ff]/40 p-3 font-semibold text-blue-900">
                                    <div>Report Details</div>
                                    <div className="text-center">Status</div>
                                    <div className="text-center">Date</div>
                                    <div className="text-center">PDF</div>
                                </div>
                                <div className="grid grid-cols-4 p-3 items-center border-b border-cyan-50 bg-[#e8f1f5]/40 font-medium text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                                        <span>Complete Blood Count (CBC)</span>
                                    </div>
                                    <div className="text-center text-blue-600 font-bold">Ready</div>
                                    <div className="text-center text-blue-500">July 01, 2026</div>
                                    <div className="flex justify-center">
                                        <button className="text-[#00b4d8] hover:text-blue-700 transition">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 p-3 items-center bg-[#e8f1f5]/20 font-medium text-blue-900">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                                        <span>Chest X-Ray (Posterior)</span>
                                    </div>
                                    <div className="text-center text-blue-400 font-bold">Pending</div>
                                    <div className="text-center text-blue-500">June 28, 2026</div>
                                    <div className="flex justify-center">
                                        <button className="text-gray-400 cursor-not-allowed">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: Care Team Tools Footer Deck */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-[#0f4c81] font-bold text-lg mb-6">Care Team & Quick Tools</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#0f4c81] text-sm">Primary Care Directory</h3>
                            </div>
                            <div className="space-y-4 mb-5">
                                <div className="flex justify-between items-center font-bold text-xs text-blue-900">
                                    <span>Dr. Sarah Jenkins (Cardiologist)</span>
                                    <CheckCircle2 className="w-4 h-4 text-[#00b4d8] fill-cyan-50" />
                                </div>
                                <div className="flex justify-between items-center font-bold text-xs text-blue-900">
                                    <span>Dr. Marcus Vance (General Care)</span>
                                    <CheckCircle2 className="w-4 h-4 text-[#00b4d8] fill-cyan-50" />
                                </div>
                            </div>
                            <button className="w-full bg-[#52b788] hover:bg-[#409a73] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition">
                                <span>Message Care Team</span>
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="space-y-3.5">
                            <button className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-between shadow-sm transition">
                                <span>Download Insurance Card PDF</span>
                                <Download className="w-4 h-4" />
                            </button>
                            <button className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-between shadow-sm transition">
                                <span>Request Routine Rx Refill</span>
                                <Send className="w-4 h-4" />
                            </button>
                            <button className="w-full bg-[#00b4d8] hover:bg-[#0096b4] text-white font-bold text-xs py-3 px-5 rounded-xl flex items-center justify-between shadow-sm transition">
                                <span>View Emergency Details</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}