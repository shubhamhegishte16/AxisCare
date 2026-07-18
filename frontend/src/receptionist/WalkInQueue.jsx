import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, UserPlus, Siren, Loader2, X } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';
import { receptionistService } from '../services/receptionistService';

const statusStyles = {
  Waiting: 'bg-blue-50 text-[#2563EB]',
  Serving: 'bg-amber-50 text-amber-600',
  Completed: 'bg-emerald-50 text-emerald-600',
};

const emptyEntry = { patientName: '', phoneNumber: '', department: '', priority: 'Normal' };

const WalkInQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState(emptyEntry);
  const [adding, setAdding] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await receptionistService.getQueue();
      if (res.success) setQueue(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const setEntryStatus = async (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: status }));
    try {
      const res = await receptionistService.updateQueueStatus(id, status);
      if (res.success) setQueue((q) => q.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      setError(err.message || 'Failed to update queue.');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEntry.patientName) return;
    setAdding(true);
    try {
      const res = await receptionistService.addToQueue(newEntry);
      if (res.success) {
        setQueue((q) => [...q, res.data]);
        setNewEntry(emptyEntry);
        setShowAdd(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to add to queue.');
    } finally {
      setAdding(false);
    }
  };

  const waitingCount = queue.filter((q) => q.status === 'Waiting').length;
  const servingCount = queue.filter((q) => q.status === 'Serving').length;
  const emergencyCount = queue.filter((q) => q.priority === 'Emergency' && q.status !== 'Completed').length;

  return (
    <ReceptionistLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Walk-in Queue</h1>
          <p className="text-sm text-slate-400 mt-1">Manage today's walk-in patients in real time.</p>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Add to Queue
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl mb-4">{error}</div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5 mb-6 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Patient Name *</label>
            <input
              value={newEntry.patientName}
              onChange={(e) => setNewEntry({ ...newEntry, patientName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              placeholder="Full name"
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Phone</label>
            <input
              value={newEntry.phoneNumber}
              onChange={(e) => setNewEntry({ ...newEntry, phoneNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              placeholder="Phone number"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Department</label>
            <input
              value={newEntry.department}
              onChange={(e) => setNewEntry({ ...newEntry, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              placeholder="Department"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Priority</label>
            <select
              value={newEntry.priority}
              onChange={(e) => setNewEntry({ ...newEntry, priority: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option>Normal</option>
              <option>Emergency</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={adding} className="bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {adding ? 'Adding…' : 'Add'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Waiting</p>
          <p className="text-3xl font-extrabold text-slate-800">{waitingCount}</p>
        </div>
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Being Served</p>
          <p className="text-3xl font-extrabold text-slate-800">{servingCount}</p>
        </div>
        <div className="bg-white rounded-[18px] border border-red-100 shadow-sm p-5">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">Emergency</p>
          <p className="text-3xl font-extrabold text-red-500">{emergencyCount}</p>
        </div>
      </div>

      {/* Queue cards */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 bg-white rounded-[18px] border border-slate-100 shadow-sm">
          <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
          <span className="text-sm text-slate-400">Loading queue...</span>
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-[18px] border border-slate-100 shadow-sm py-16 text-center text-sm text-slate-400">
          No one in the queue right now
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {queue.map((q) => (
            <div
              key={q._id}
              className={`rounded-[18px] p-5 border shadow-sm bg-white ${
                q.priority === 'Emergency' ? 'border-red-300' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">{q.queueNumber}</span>
                <div className="flex items-center gap-2">
                  {q.priority === 'Emergency' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wide">
                      <Siren className="w-3 h-3" /> Emergency
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[q.status]}`}>{q.status}</span>
                </div>
              </div>
              <p className="font-bold text-slate-800 text-sm">{q.patientName}</p>
              <p className="text-xs text-slate-400 mb-1">{q.department || '—'}</p>
              <p className="text-xs text-slate-400 mb-4">Arrived {q.arrivalTime}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setEntryStatus(q._id, 'Serving')}
                  disabled={q.status !== 'Waiting' || !!actionLoading[q._id]}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#2563EB] disabled:opacity-40 rounded-lg py-2 hover:bg-blue-700 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Next
                </button>
                <button
                  onClick={() => setEntryStatus(q._id, 'Completed')}
                  disabled={q.status === 'Completed' || !!actionLoading[q._id]}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 disabled:opacity-40 rounded-lg py-2 hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ReceptionistLayout>
  );
};

export default WalkInQueue;
