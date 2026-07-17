import React, { useState } from 'react';
import { Search, Eye, FolderHeart } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';

const patients = [
  { id: 'PT-2291', name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '98765 43210', doctor: 'Dr. Ananya Sharma', lastVisit: '12 Jul 2026' },
  { id: 'PT-2292', name: 'Priya Mehta', age: 32, gender: 'Female', phone: '98765 11223', doctor: 'Dr. Vikram Rao', lastVisit: '14 Jul 2026' },
  { id: 'PT-2293', name: 'Amit Verma', age: 51, gender: 'Male', phone: '98765 99887', doctor: 'Dr. Neha Kapoor', lastVisit: '15 Jul 2026' },
  { id: 'PT-2294', name: 'Sunita Rao', age: 29, gender: 'Female', phone: '98765 44556', doctor: 'Dr. Ananya Sharma', lastVisit: '10 Jul 2026' },
  { id: 'PT-2295', name: 'Karan Malhotra', age: 38, gender: 'Male', phone: '98765 22110', doctor: 'Dr. Farhan Ali', lastVisit: '16 Jul 2026' },
  { id: 'PT-2296', name: 'Neha Patil', age: 27, gender: 'Female', phone: '98765 33445', doctor: 'Dr. Vikram Rao', lastVisit: '17 Jul 2026' },
];

const PatientRecords = () => {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ReceptionistLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Patient Records</h1>
          <p className="text-sm text-slate-400 mt-1">Search and view registered patients.</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#EFF6FF] items-center justify-center">
          <FolderHeart className="w-6 h-6 text-[#2563EB]" />
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or doctor..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                <th className="px-5 py-3 font-bold">Patient ID</th>
                <th className="px-5 py-3 font-bold">Name</th>
                <th className="px-5 py-3 font-bold">Age / Gender</th>
                <th className="px-5 py-3 font-bold">Phone</th>
                <th className="px-5 py-3 font-bold">Doctor</th>
                <th className="px-5 py-3 font-bold">Last Visit</th>
                <th className="px-5 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">No patients found</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">{p.id}</td>
                    <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.age} / {p.gender}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.phone}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.doctor}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.lastVisit}</td>
                    <td className="px-5 py-3">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default PatientRecords;
