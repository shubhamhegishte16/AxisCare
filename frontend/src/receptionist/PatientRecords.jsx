import React, { useState, useEffect } from 'react';
import { Search, Eye, FolderHeart, Loader2 } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';
import { patientService } from '../services/patientService';

const PatientRecords = () => {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await patientService.getAllPatients();
        if (res.success) setPatients(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    const name = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    const doctor = (p.doctor || '').toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      (p.patientId || '').toLowerCase().includes(search.toLowerCase()) ||
      doctor.includes(search.toLowerCase())
    );
  });

  const calcAge = (dob) => {
    if (!dob) return '—';
    const parts = dob.split('/');
    if (parts.length !== 3) return '—';
    const birth = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
    if (isNaN(birth)) return '—';
    const diff = Date.now() - birth.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

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

      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

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

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <span className="text-sm text-slate-400">Loading patients...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide bg-[#F8FAFC]">
                  <th className="px-5 py-3 font-bold">Patient ID</th>
                  <th className="px-5 py-3 font-bold">Name</th>
                  <th className="px-5 py-3 font-bold">Age / Gender</th>
                  <th className="px-5 py-3 font-bold">Phone</th>
                  <th className="px-5 py-3 font-bold">Registered</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No patients found</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id} className="border-t border-slate-50 hover:bg-[#F8FAFC]/70 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">{p.patientId}</td>
                      <td className="px-5 py-3 font-bold text-slate-800 whitespace-nowrap">{p.firstName} {p.lastName}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{calcAge(p.dateOfBirth)} / {p.gender}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.phoneNumber}</td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{p.dateOfRegistration}</td>
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
        )}
      </div>
    </ReceptionistLayout>
  );
};

export default PatientRecords;
