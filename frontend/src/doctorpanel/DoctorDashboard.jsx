import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import {
  Calendar,
  Users,
  Clock,
  FlaskConical,
  ChevronDown,
  Plus,
  FileText,
  Activity,
  Upload,
  FileCheck,
  UserPlus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { doctorService } from '../services/doctorService';
import { formatDistanceToNow } from 'date-fns';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashRes, profileRes] = await Promise.all([
          doctorService.getDashboard(),
          doctorService.getProfile()
        ]);
        setDashboardData(dashRes.data);
        setDoctorProfile(profileRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        </main>
      </div>
    );
  }

  const {
    todaysAppointmentsCount = 0,
    patientsSeenCount = 0,
    upcomingAppointmentsCount = 0,
    pendingLabReportsCount = 0,
    todaysSchedule = [],
    patientOverviewData = [],
    recentPrescriptions = [],
    pendingLabReports = []
  } = dashboardData || {};

  const totalPatientsPie = patientOverviewData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, Dr. {doctorProfile?.user?.fullName?.split(' ')[0] || 'Doctor'} 👋
            </h1>
            <p className="text-gray-500 text-sm">Here's what's happening with your practice today.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            <Calendar className="w-4 h-4 text-blue-600" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="TODAY'S APPOINTMENTS" value={todaysAppointmentsCount} subtext="Scheduled for today" icon={Calendar} iconColor="text-blue-600" bgColor="bg-blue-50" subtextColor="text-gray-500" />
          <StatCard title="PATIENTS SEEN" value={patientsSeenCount} subtext="Total unique patients" icon={Users} iconColor="text-blue-600" bgColor="bg-blue-50" subtextColor="text-gray-500" />
          <StatCard title="UPCOMING" value={upcomingAppointmentsCount} subtext="Scheduled appointments" icon={Clock} iconColor="text-orange-500" bgColor="bg-orange-50" subtextColor="text-gray-500" />
          <StatCard title="PENDING LAB REPORTS" value={pendingLabReportsCount} subtext="View and upload" icon={FlaskConical} iconColor="text-red-500" bgColor="bg-red-50" subtextColor="text-gray-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Today's Schedule</h2>
              <button className="text-blue-600 text-sm font-semibold hover:underline">View Calendar +</button>
            </div>
            <div className="p-5 flex-1 relative">
              {todaysSchedule.length > 0 ? (
                <>
                  <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gray-200 z-0"></div>
                  <div className="flex flex-col gap-6 relative z-10">
                    {todaysSchedule.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-16 text-xs font-semibold text-gray-500 pt-1 shrink-0">{item.time}</div>
                        <div className={`flex-1 border rounded-lg p-3 flex items-center justify-between bg-white ${item.status === 'IN PROGRESS' ? 'border-blue-300 shadow-sm' : 'border-gray-100'}`}>
                          <div className="flex items-center gap-3">
                            <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                            <div>
                              <p className="text-sm font-bold text-gray-900 leading-tight">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <div>
                            {item.status === 'COMPLETED' ? (
                              <span className="text-[10px] font-bold text-green-600 tracking-wide">COMPLETED</span>
                            ) : (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">IN PROGRESS</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  <p>No appointments scheduled for today.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl text-center">
              <button className="text-sm font-semibold text-blue-600 hover:underline">View All Appointments</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Patient Overview</h2>
              <button className="flex items-center gap-1 text-xs font-semibold text-gray-600 border border-gray-200 px-2 py-1 rounded">
                All Time
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
              {totalPatientsPie > 0 ? (
                <>
                  <div className="h-48 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientOverviewData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {patientOverviewData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-blue-500">{totalPatientsPie}</span>
                      <span className="text-xs font-medium text-gray-500">Total Patients</span>
                    </div>
                  </div>
                  <div className="w-full mt-6 grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    {patientOverviewData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-gray-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {item.value} <span className="text-gray-400 font-normal">({Math.round((item.value / totalPatientsPie) * 100)}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>No patient data available yet.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <button className="text-sm font-semibold text-blue-600 hover:underline">View All Patients →</button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Recent Prescriptions</h2>
                <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {recentPrescriptions.length > 0 ? recentPrescriptions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-500 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {item.time ? formatDistanceToNow(new Date(item.time), { addSuffix: true }) : 'Just Now'}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent prescriptions</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Pending Lab Reports</h2>
                <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {pendingLabReports.length > 0 ? pendingLabReports.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-500 shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="text-xs text-red-500 font-bold">{item.time}</div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No pending lab reports</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <QuickActionButton icon={Plus} label="New Consultation" onClick={() => navigate('/doctordashboard/patients')} />
            <QuickActionButton icon={FileText} label="Add Prescription" onClick={() => navigate('/doctordashboard/new-prescription')} />
            <QuickActionButton icon={Activity} label="Order Lab Test" onClick={() => navigate('/doctordashboard/create-report')} />
            <QuickActionButton icon={Upload} label="Upload Report" onClick={() => navigate('/doctordashboard/create-report')} />
            <QuickActionButton icon={FileCheck} label="Generate Certificate" onClick={() => navigate('/doctordashboard/reports')} />
            <QuickActionButton icon={UserPlus} label="Add Follow-up" onClick={() => navigate('/doctordashboard/appointments')} />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon: Icon, iconColor, bgColor, subtextColor = "text-green-600" }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="text-xs font-bold text-gray-500 tracking-wide">{title}</h3>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-extrabold text-blue-600 leading-none">{value}</span>
      </div>
      <p className={`text-xs font-semibold mt-2 ${subtextColor}`}>{subtext}</p>
    </div>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-gray-700 hover:text-blue-600 group">
    <Icon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
    <span className="text-xs font-bold text-center">{label}</span>
  </button>
);

export default DoctorDashboard;