import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Save, FileCheck2, Phone, Plus, Loader2 } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';
import { doctorService } from '../services/doctorService';

const NewPrescription = () => {
  const navigate = useNavigate();
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loadingApts, setLoadingApts] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Doctor Info State
  const [doctorName, setDoctorName] = useState('Ananya Sharma');
  const [doctorFirstName, setDoctorFirstName] = useState('Shubham');
  const [profile, setProfile] = useState(null);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [exercises, setExercises] = useState('');
  const [dietAdvice, setDietAdvice] = useState('');
  const [diagnosisPrimary, setDiagnosisPrimary] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [labTests, setLabTests] = useState('');
  
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  
  const [vitals, setVitals] = useState({
    bloodPressure: '', pulseRate: '', temperature: '', weight: '', height: '', spO2: '', bloodSugar: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 1. Fetch Doctor Profile
    const fetchProfile = async () => {
      try {
        const res = await doctorService.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          if (res.data.user && res.data.user.fullName) {
            setDoctorName(res.data.user.fullName);
            setDoctorFirstName(res.data.user.fullName.split(' ')[0]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch doctor profile", e);
      }
    };
    
    // Initial sync load from localStorage fallback
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.fullName) {
          setDoctorName(user.fullName);
          setDoctorFirstName(user.fullName.split(' ')[0]);
        }
      } catch (e) { }
    }
    fetchProfile();

    // 2. Fetch Completed Appointments
    const fetchAppointments = async () => {
      try {
        const res = await appointmentService.getDoctorAppointments();
        if (res.success) {
          // Filter to only 'Completed' appointments
          const completed = res.data.filter(apt => apt.status === 'Completed');
          setCompletedAppointments(completed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingApts(false);
      }
    };
    fetchAppointments();
  }, []);

  const handlePatientChange = (e) => {
    const aptId = e.target.value;
    if (!aptId) {
      setSelectedAppointment(null);
      return;
    }
    const apt = completedAppointments.find(a => a._id === aptId);
    setSelectedAppointment(apt);
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (status) => {
    if (!selectedAppointment) {
      alert("Please select a patient first.");
      return;
    }
    if (!diagnosisPrimary && status === 'Generated') {
      alert("Primary diagnosis is required to generate a prescription.");
      return;
    }

    setSaving(true);
    const payload = {
      appointmentId: selectedAppointment._id,
      patientName: selectedAppointment.fullName,
      patientAge: selectedAppointment.age,
      patientGender: selectedAppointment.gender,
      patientContact: selectedAppointment.phoneNumber,
      department: selectedAppointment.department || 'General',
      visitType: selectedAppointment.appointmentType,
      consultationDate: selectedAppointment.preferredDate,
      chiefComplaint,
      symptoms,
      diagnosisPrimary,
      diagnosisNotes,
      exercises,
      dietAdvice,
      additionalNotes,
      labTests,
      medicines: medicines.filter(m => m.name.trim() !== ''), // only send filled medicines
      vitals,
      status
    };

    try {
      const res = await prescriptionService.createPrescription(payload);
      if (res.success) {
        alert(res.message);
        navigate('/doctordashboard/prescriptions');
      }
    } catch (err) {
      alert(err.message || 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">New Prescription</h1>
            <div className="flex items-center gap-2 text-sm">
              <Link to="/doctordashboard/prescriptions" className="text-gray-500 hover:text-gray-900 transition-colors">Prescriptions</Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#00B9D6] font-medium">New Prescription</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={saving}
              onClick={() => handleSave('Draft')} 
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button 
              disabled={saving}
              onClick={() => handleSave('Generated')}
              className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck2 className="w-4 h-4" />}
              Generate Prescription
            </button>
          </div>
        </div>

        {/* Patient Selection Dropdown */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Choose Patient:</label>
            <select 
              className="w-full sm:max-w-md p-2 border border-gray-300 rounded-md text-sm focus:ring-[#00B9D6] outline-none"
              onChange={handlePatientChange}
              defaultValue=""
            >
              <option value="" disabled>-- Select a patient with a completed appointment --</option>
              {loadingApts ? <option disabled>Loading...</option> : 
                completedAppointments.length === 0 ? <option disabled>No completed appointments found</option> :
                completedAppointments.map(apt => (
                  <option key={apt._id} value={apt._id}>{apt.fullName} (Consulted: {apt.preferredDate})</option>
                ))
              }
            </select>
          </div>

          {selectedAppointment ? (
            <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAppointment.fullName)}&background=random`} alt={selectedAppointment.fullName} className="w-14 h-14 rounded-full object-cover bg-gray-100" />
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">{selectedAppointment.fullName}</h2>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                    <span>{selectedAppointment.age} / {selectedAppointment.gender}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" />
                    {selectedAppointment.phoneNumber}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-8 lg:gap-12 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">APPOINTMENT ID</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.appointmentId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">CONSULTATION DATE</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.preferredDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">DEPARTMENT</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">VISIT TYPE</p>
                  <span className="inline-block bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">{selectedAppointment.appointmentType || 'In-Person'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic py-2">Please select a patient from the dropdown above to view patient details and fill out the prescription form.</div>
          )}
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <FormCard title="1. Chief Complaint" description="Describe the main reason for the visit.">
              <textarea 
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                className="w-full h-32 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter chief complaint"
              ></textarea>
            </FormCard>
            <FormCard title="2. Symptoms" description="List all symptoms reported by the patient.">
              <textarea 
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                className="w-full h-32 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter symptoms"
              ></textarea>
            </FormCard>
            <div className="grid grid-cols-2 gap-4">
              <FormCard title="5. Exercises" description="Mention recommended exercises or physiotherapy.">
                <textarea 
                  value={exercises}
                  onChange={e => setExercises(e.target.value)}
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter exercises or physiotherapy advice"
                ></textarea>
              </FormCard>
              <FormCard title="6. Diet Advice" description="Mention diet recommendations for the patient.">
                <textarea 
                  value={dietAdvice}
                  onChange={e => setDietAdvice(e.target.value)}
                  className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter diet advice"
                ></textarea>
              </FormCard>
            </div>
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <FormCard title="3. Diagnosis">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Primary Diagnosis <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={diagnosisPrimary}
                  onChange={e => setDiagnosisPrimary(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent placeholder-gray-400"
                  placeholder="Enter diagnosis"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Diagnosis Notes</label>
                <textarea 
                  value={diagnosisNotes}
                  onChange={e => setDiagnosisNotes(e.target.value)}
                  className="w-full h-20 p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                  placeholder="Enter additional diagnosis notes (if any)"
                ></textarea>
              </div>
            </FormCard>
            
            <FormCard title="4. Medicines">
              <div className="overflow-x-auto hide-scrollbar mb-4">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="text-gray-500 font-bold uppercase tracking-wide border-b border-gray-100">
                      <th className="pb-2 font-bold w-1/4">MEDICINE NAME</th>
                      <th className="pb-2 font-bold w-1/5">DOSAGE</th>
                      <th className="pb-2 font-bold w-1/5">FREQUENCY</th>
                      <th className="pb-2 font-bold w-1/5">DURATION</th>
                      <th className="pb-2 font-bold">INSTR...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map((med, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-2">
                          <input value={med.name} onChange={e => handleMedicineChange(i, 'name', e.target.value)} type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="Enter medicine" />
                        </td>
                        <td className="py-2 pr-2">
                          <input value={med.dosage} onChange={e => handleMedicineChange(i, 'dosage', e.target.value)} type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="e.g. 500mg" />
                        </td>
                        <td className="py-2 pr-2">
                          <input value={med.frequency} onChange={e => handleMedicineChange(i, 'frequency', e.target.value)} type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="e.g. 1-0-1" />
                        </td>
                        <td className="py-2 pr-2">
                          <input value={med.duration} onChange={e => handleMedicineChange(i, 'duration', e.target.value)} type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="e.g. 5 days" />
                        </td>
                        <td className="py-2">
                          <input value={med.instructions} onChange={e => handleMedicineChange(i, 'instructions', e.target.value)} type="text" className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none" placeholder="e.g. After food" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleAddMedicine} className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-md hover:bg-teal-100 transition-colors border border-teal-100">
                <Plus className="w-3 h-3" /> Add Medicine
              </button>
            </FormCard>
            
            <FormCard title="7. Additional Notes" description="Any extra notes for the patient.">
              <label className="block text-[10px] font-semibold text-gray-500 mb-1">Doctor Notes</label>
              <textarea 
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter any additional notes"
              ></textarea>
            </FormCard>
          </div>
          
          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <FormCard title="8. Vitals">
              <div className="grid grid-cols-2 gap-4">
                <VitalInput label="Blood Pressure" placeholder="Enter BP (e.g. 120/80 mmHg)" value={vitals.bloodPressure} onChange={v => handleVitalChange('bloodPressure', v)} />
                <VitalInput label="Pulse Rate" placeholder="Enter pulse rate" value={vitals.pulseRate} onChange={v => handleVitalChange('pulseRate', v)} />
                <VitalInput label="Temperature" placeholder="Enter temp" value={vitals.temperature} onChange={v => handleVitalChange('temperature', v)} />
                <VitalInput label="Weight" placeholder="Enter weight" value={vitals.weight} onChange={v => handleVitalChange('weight', v)} />
                <VitalInput label="Height" placeholder="Enter height" value={vitals.height} onChange={v => handleVitalChange('height', v)} />
                <VitalInput label="SpO2" placeholder="Enter SpO2" value={vitals.spO2} onChange={v => handleVitalChange('spO2', v)} />
                <div className="col-span-2">
                  <VitalInput label="Blood Sugar (RBS)" placeholder="Enter RBS" value={vitals.bloodSugar} onChange={v => handleVitalChange('bloodSugar', v)} />
                </div>
              </div>
            </FormCard>
            <FormCard title="9. Lab Tests (If Any)" description="List all tests or investigations you want to recommend.">
              <textarea 
                value={labTests}
                onChange={e => setLabTests(e.target.value)}
                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent resize-none placeholder-gray-400"
                placeholder="Enter lab tests / investigations"
              ></textarea>
            </FormCard>
            <FormCard title="11. Doctor Signature">
              <div className="border border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center mb-4 bg-gray-50/50">
                <span className="font-serif text-3xl italic text-gray-800">{doctorFirstName}</span></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Dr. {doctorName}</p>
                <p className="text-xs text-gray-500 font-medium leading-tight">{profile?.specialization || 'General Physician'}</p>
                <p className="text-xs text-gray-400 font-medium leading-tight">Reg. No. {profile?.licenseNumber || 'N/A'}</p></div></FormCard>
          </div>
        </div>
      </main>
    </div>
  );
};

const FormCard = ({ title, description, children }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
    <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
    <div className="flex-1 flex flex-col">
      {children}
    </div>
    {description && <p className="text-[10px] text-gray-400 font-medium mt-3">{description}</p>}
  </div>
);

const VitalInput = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">{label}</label>
    <input 
      type="text" 
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2 bg-white border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-[#00B9D6] outline-none placeholder-gray-400"
      placeholder={placeholder}
    />
  </div>
);

export default NewPrescription;
