import React from 'react';
import { Search, Bell, Calendar, ChevronDown } from 'lucide-react';

const Topbar = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search patients, appointments..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]/40 transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-5">
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500 bg-[#F8FAFC] px-3 py-2 rounded-full">
          <Calendar className="w-4 h-4 text-[#2563EB]" />
          {today}
        </div>

        <button className="relative w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-100 cursor-pointer">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Sarah, Receptionist"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-bold text-slate-800">Sarah</p>
            <p className="text-xs text-slate-400">Receptionist</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
