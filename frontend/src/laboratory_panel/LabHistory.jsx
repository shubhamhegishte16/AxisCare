import React,{useState} from 'react';
import {Search,ChevronDown,Download,Eye,CheckCircle2,AlertTriangle,X,RefreshCw,ThumbsDown,ChevronLeft,ChevronRight} from 'lucide-react';
import LabHeader from './LabHeader';
const HIST=[
  {id:'TR-2025-0516-001',patient:'Amit Kumar',type:'Complete Blood Count (CBC)',sample:'Blood',reqDate:'22 May 2025, 09:00 AM',resDate:'23 May 2025, 10:30 AM',status:'Completed',tech:'Rahul Verma'},
  {id:'TR-2025-0516-002',patient:'Neha Sharma',type:'Lipid Profile',sample:'Blood',reqDate:'22 May 2025, 09:10 AM',resDate:'23 May 2025, 10:20 AM',status:'Completed',tech:'Rahul Verma'},
];
const TABS=[
  {label:'All History',count:128,icon:null,color:''},
  {label:'Completed',count:92,icon:CheckCircle2,color:'text-emerald-500'},
  {label:'Abnormal',count:14,icon:AlertTriangle,color:'text-red-400'},
  {label:'Cancelled',count:6,icon:X,color:'text-gray-400'},
  {label:'Replaced',count:5,icon:RefreshCw,color:'text-orange-400'},
  {label:'Rejected',count:11,icon:ThumbsDown,color:'text-red-500'},
];
const SUMMARY=[
  {label:'Total Tests',val:128,color:'text-blue-600'},
  {label:'Completed',val:92,color:'text-emerald-500'},
  {label:'Abnormal',val:14,color:'text-red-500'},
  {label:'Cancelled',val:6,color:'text-gray-500'},
  {label:'Replaced',val:5,color:'text-orange-500'},
  {label:'Rejected',val:11,color:'text-red-400'},
];
const ACTIVITY=[
  {text:'CBC report for Amit Kumar',sub:'Completed • 10:30 AM'},
  {text:'Lipid Profile for Neha Sharma',sub:'Completed • 10:20 AM'},
  {text:'KFT for Vikram Singh',sub:'Completed • 11:40 AM'},
];
const sBadge=s=>s==='Completed'?'bg-emerald-50 text-emerald-600 border border-emerald-200':s==='Abnormal'?'bg-red-50 text-red-500 border border-red-200':'bg-gray-100 text-gray-500 border border-gray-200';
export default function LabHistory(){
  const [tab,setTab]=useState('All History');
  const [search,setSearch]=useState('');
  const filtered=HIST.filter(h=>tab==='All History'||h.status===tab).filter(h=>!search||h.patient.toLowerCase().includes(search.toLowerCase())||h.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <LabHeader/>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-gray-900">Test History</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">View history of all processed laboratory tests.</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-44">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
            <input placeholder="Search by Patient Name, ID or Test ID..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#00B9D6]/30 focus:border-[#00B9D6] transition-all"/>
          </div>
          {[['DATE RANGE','01 Apr 2025 - 23 May 2025'],['TEST TYPE','All Tests'],['STATUS','All Status'],['SAMPLE TYPE','All Sample Types']].map(([lbl,val])=>(
            <div key={lbl} className="min-w-36">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1">{lbl}</p>
              <div className="flex items-center justify-between gap-1.5 border border-gray-200 rounded-xl px-3 py-2.5 bg-white cursor-pointer hover:bg-gray-50 text-xs font-bold text-gray-700">
                <span>{val}</span><ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"/>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-2 border border-[#00B9D6] text-[#00B9D6] hover:bg-[#00B9D6] hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm self-end">
            <Download className="w-3.5 h-3.5"/>Export History
          </button>
        </div>
        <div className="flex gap-5 items-start">
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-0 px-4 pt-4 border-b border-gray-100 overflow-x-auto">
              {TABS.map(t=>(
                <button key={t.label} onClick={()=>setTab(t.label)} className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${tab===t.label?'border-[#00B9D6] text-[#00B9D6]':'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {t.icon&&<t.icon className={`w-3.5 h-3.5 ${t.color}`}/>}
                  {t.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab===t.label?'bg-[#00B9D6] text-white':'bg-gray-100 text-gray-500'}`}>{t.count}</span>
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    {['Test ID','Patient Name','Test Type','Sample Type','Request Date','Result Date','Status','Technician','Action'].map(h=>(
                      <th key={h} className="py-3 px-4 text-[10px] uppercase tracking-wider font-bold text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r=>(
                    <tr key={r.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-gray-700">{r.id}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">{r.patient}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-600">{r.type}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-600">{r.sample}</td>
                      <td className="py-4 px-4 text-xs text-gray-500 font-semibold">{r.reqDate}</td>
                      <td className="py-4 px-4 text-xs text-gray-500 font-semibold">{r.resDate}</td>
                      <td className="py-4 px-4"><span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${sBadge(r.status)}`}>{r.status}</span></td>
                      <td className="py-4 px-4 text-xs font-semibold text-gray-600">{r.tech}</td>
                      <td className="py-4 px-4"><button className="text-[#00B9D6] hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Eye className="w-4 h-4"/></button></td>
                    </tr>
                  ))}
                  {filtered.length===0&&<tr><td colSpan="9" className="py-14 text-center text-gray-400 font-semibold text-sm">No records found.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400 font-semibold">Showing 1 to {filtered.length} of 128 results</p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronLeft className="w-3.5 h-3.5"/></button>
                {[1,2,3,4,5].map(p=><button key={p} className={`w-7 h-7 rounded-lg text-xs font-bold ${p===1?'bg-[#00B9D6] text-white':'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>)}
                <span className="text-gray-400 text-xs">...</span>
                <button className="w-7 h-7 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">13</button>
                <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"><ChevronRight className="w-3.5 h-3.5"/></button>
              </div>
            </div>
          </div>
          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">History Summary</h3>
              <div className="space-y-3">
                {SUMMARY.map(s=>(
                  <div key={s.label} className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">{s.label}</span>
                    <span className={`font-extrabold ${s.color}`}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {ACTIVITY.map((a,i)=>(
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{a.text}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{a.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-xs font-bold text-[#00B9D6] border border-[#00B9D6] rounded-xl py-2 hover:bg-blue-50 transition-colors">View All Activity</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
