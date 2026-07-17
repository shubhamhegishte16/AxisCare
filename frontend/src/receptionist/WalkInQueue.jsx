import React, { useState } from 'react';
import { PhoneCall, CheckCircle2, UserPlus, Siren } from 'lucide-react';
import ReceptionistLayout from './ReceptionistLayout';

const initialQueue = [
  { no: 'Q-104', name: 'Deepak Joshi', arrival: '10:12 AM', priority: 'Normal', dept: 'General Medicine', status: 'Waiting' },
  { no: 'Q-105', name: 'Ritu Singh', arrival: '10:18 AM', priority: 'Emergency', dept: 'Cardiology', status: 'Waiting' },
  { no: 'Q-106', name: 'Manoj Tiwari', arrival: '10:25 AM', priority: 'Normal', dept: 'Orthopedics', status: 'Waiting' },
  { no: 'Q-107', name: 'Sneha Kulkarni', arrival: '10:31 AM', priority: 'Normal', dept: 'Dermatology', status: 'Serving' },
  { no: 'Q-108', name: 'Arvind Nair', arrival: '10:40 AM', priority: 'Normal', dept: 'Neurology', status: 'Waiting' },
];

const statusStyles = {
  Waiting: 'bg-blue-50 text-[#2563EB]',
  Serving: 'bg-amber-50 text-amber-600',
  Completed: 'bg-emerald-50 text-emerald-600',
};

const WalkInQueue = () => {
  const [queue, setQueue] = useState(initialQueue);

  const callNext = (no) => setQueue((q) => q.map((item) => (item.no === no ? { ...item, status: 'Serving' } : item)));
  const complete = (no) => setQueue((q) => q.map((item) => (item.no === no ? { ...item, status: 'Completed' } : item)));

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
        <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <UserPlus className="w-4 h-4" /> Add to Queue
        </button>
      </div>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {queue.map((q) => (
          <div
            key={q.no}
            className={`rounded-[18px] p-5 border shadow-sm bg-white ${
              q.priority === 'Emergency' ? 'border-red-300' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">{q.no}</span>
              <div className="flex items-center gap-2">
                {q.priority === 'Emergency' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wide">
                    <Siren className="w-3 h-3" /> Emergency
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[q.status]}`}>{q.status}</span>
              </div>
            </div>
            <p className="font-bold text-slate-800 text-sm">{q.name}</p>
            <p className="text-xs text-slate-400 mb-1">{q.dept}</p>
            <p className="text-xs text-slate-400 mb-4">Arrived {q.arrival}</p>
            <div className="flex gap-2">
              <button
                onClick={() => callNext(q.no)}
                disabled={q.status !== 'Waiting'}
                className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-white bg-[#2563EB] disabled:opacity-40 rounded-lg py-2 hover:bg-blue-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Next
              </button>
              <button
                onClick={() => complete(q.no)}
                disabled={q.status === 'Completed'}
                className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 disabled:opacity-40 rounded-lg py-2 hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </ReceptionistLayout>
  );
};

export default WalkInQueue;
