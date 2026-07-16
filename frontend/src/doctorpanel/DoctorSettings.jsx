import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { 
  User,
  Briefcase,
  Lock,
  Camera,
  Trash2,
  Key,
  ShieldCheck,
  LogOut,
  Save,
  Link2,
  AtSign,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';

const DoctorSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '', email: '', phone: '', alternatePhone: '',
    dateOfBirth: '', gender: '', qualification: '', experience: '',
    nationality: '', aboutYou: '', specialization: '', department: '',
    licenseNumber: '', consultationFee: '', joiningDate: '', university: '',
    degree: '', professionalBio: '', address: '', city: '', state: '',
    pinCode: '', linkedinUrl: '', twitterUrl: '', websiteUrl: '',
    avatar: 'https://i.pravatar.cc/150?img=32'
  });
  
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Fetch profile on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/profile", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const d = data.data;
          setProfile({
            ...profile,
            ...d,
            fullName: d.user?.fullName || '',
            email: d.user?.email || '',
            phone: d.user?.phone || '',
            avatar: d.user?.avatar ? `http://localhost:5000${d.user.avatar}` : 'https://i.pravatar.cc/150?img=32',
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch("http://localhost:5000/api/doctor/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profile)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) alert("Profile saved successfully!");
        else alert("Failed to save profile: " + data.message);
      })
      .catch(err => console.error(err));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    fetch("http://localhost:5000/api/doctor/upload-avatar", {
      method: "POST",
      credentials: "include",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(prev => ({ ...prev, avatar: `http://localhost:5000${data.avatar}` }));
          alert("Avatar updated!");
        } else {
          alert("Failed to upload avatar");
        }
      })
      .catch(err => console.error(err));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h1>
            <p className="text-gray-500 text-sm">Manage your personal information and professional details.</p>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-[#00B9D6] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#00a3bd] transition-colors">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Personal Information */}
            <SectionCard icon={User} title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel>FULL NAME</FieldLabel>
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>DATE OF BIRTH</FieldLabel>
                  <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>GENDER</FieldLabel>
                  <select name="gender" value={profile.gender} onChange={handleChange} className={inputCls}>
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <FieldLabel>QUALIFICATION</FieldLabel>
                  <input type="text" name="qualification" value={profile.qualification} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>EXPERIENCE</FieldLabel>
                  <input type="text" name="experience" value={profile.experience} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>NATIONALITY</FieldLabel>
                  <input type="text" name="nationality" value={profile.nationality} onChange={handleChange} className={inputCls} />
                </div>
              </div>
              <div className="mt-4">
                <FieldLabel>ABOUT YOU</FieldLabel>
                <textarea
                  name="aboutYou"
                  value={profile.aboutYou}
                  onChange={handleChange}
                  maxLength={300}
                  rows={4}
                  className={inputCls + " resize-none"}
                ></textarea>
                <p className="text-[11px] text-gray-400 text-right mt-1">{profile.aboutYou?.length || 0} / 300</p>
              </div>
            </SectionCard>

            {/* Professional Information */}
            <SectionCard icon={Briefcase} title="Professional Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <FieldLabel>SPECIALIZATION</FieldLabel>
                  <input type="text" name="specialization" value={profile.specialization} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>DEPARTMENT</FieldLabel>
                  <input type="text" name="department" value={profile.department} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>LICENSE / REGISTRATION NO.</FieldLabel>
                  <input type="text" name="licenseNumber" value={profile.licenseNumber} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>CONSULTATION FEE (₹)</FieldLabel>
                  <input type="number" name="consultationFee" value={profile.consultationFee} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>JOINING DATE</FieldLabel>
                  <input type="date" name="joiningDate" value={profile.joiningDate} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>UNIVERSITY / COLLEGE</FieldLabel>
                  <input type="text" name="university" value={profile.university} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <FieldLabel>DEGREE</FieldLabel>
                  <input type="text" name="degree" value={profile.degree} onChange={handleChange} className={inputCls} />
                </div>
              </div>
              <div className="mt-4">
                <FieldLabel>PROFESSIONAL BIO</FieldLabel>
                <textarea
                  name="professionalBio"
                  value={profile.professionalBio}
                  onChange={handleChange}
                  maxLength={300}
                  rows={4}
                  className={inputCls + " resize-none"}
                ></textarea>
                <p className="text-[11px] text-gray-400 text-right mt-1">{profile.professionalBio?.length || 0} / 300</p>
              </div>
            </SectionCard>

            {/* Account Settings */}
            <SectionCard icon={Lock} title="Account Settings">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500 mt-0.5">Update your account password</p>
                  </div>
                  <button onClick={() => alert("Change password modal logic would go here")} className="flex items-center gap-2 text-xs font-bold text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors self-start">
                    <Key className="w-3.5 h-3.5" /> Change Password
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-teal-600 border border-teal-200 bg-teal-50 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors self-start">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enable 2FA
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Logout </p>
                    <p className="text-xs text-gray-500 mt-0.5">Sign out </p>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors self-start">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Profile Picture */}
            <SectionCard icon={Camera} title="Profile Picture">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 bg-[#00B9D6] rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-[#00a3bd]"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-medium mb-3">JPG, PNG or GIF. Max size of 2MB</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-xs font-bold text-[#00B9D6] border border-[#00B9D6] bg-teal-50 px-3 py-2 rounded-lg hover:bg-teal-100 transition-colors w-full justify-center mb-2">
                    <Camera className="w-3.5 h-3.5" /> Upload New Photo
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-500 border border-red-200 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors w-full justify-center">
                    <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* Contact Information */}
            <SectionCard icon={Mail} title="Contact Information">
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>EMAIL ADDRESS</FieldLabel>
                  <input type="email" name="email" value={profile.email} onChange={handleChange} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>PHONE NUMBER</FieldLabel>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <span className="bg-gray-50 px-2 py-2.5 border-r border-gray-200 text-xs text-gray-500">🇮🇳</span>
                      <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="flex-1 text-sm p-2 outline-none placeholder-gray-400 bg-white" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>ALTERNATE PHONE</FieldLabel>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <span className="bg-gray-50 px-2 py-2.5 border-r border-gray-200 text-xs text-gray-500">🇮🇳</span>
                      <input type="text" name="alternatePhone" value={profile.alternatePhone} onChange={handleChange} className="flex-1 text-sm p-2 outline-none placeholder-gray-400 bg-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel>ADDRESS</FieldLabel>
                  <input type="text" name="address" value={profile.address} onChange={handleChange} className={inputCls} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <FieldLabel>CITY</FieldLabel>
                    <input type="text" name="city" value={profile.city} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>STATE</FieldLabel>
                    <input type="text" name="state" value={profile.state} onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <FieldLabel>PIN CODE</FieldLabel>
                    <input type="text" name="pinCode" value={profile.pinCode} onChange={handleChange} className={inputCls} />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Social Links */}
            <SectionCard icon={Globe} title="Social Links (Optional)">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Link2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <input type="url" name="linkedinUrl" value={profile.linkedinUrl} onChange={handleChange} className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center shrink-0">
                    <AtSign className="w-4 h-4 text-sky-500" />
                  </div>
                  <input type="url" name="twitterUrl" value={profile.twitterUrl} onChange={handleChange} className={inputCls} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-gray-500" />
                  </div>
                  <input type="url" name="websiteUrl" value={profile.websiteUrl} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
};

const inputCls = "w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00B9D6] focus:border-transparent transition-all";

const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">{children}</label>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-500" />
      </div>
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

export default DoctorSettings;
