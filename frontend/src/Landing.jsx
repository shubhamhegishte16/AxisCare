import React from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Users, 
  BriefcaseMedical, 
  Helicopter, 
  Info, 
  Activity,
  ShieldCheck,
  Globe,
  Share2,
  Send
} from 'lucide-react';
export default function Landing() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
      <header className="bg-white py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseMedical className="text-[#004AC6]" size={24} />
            <span className="bg-gradient-to-r from-[#00B9D6] to-[#004AC6] bg-clip-text text-transparent">AxisCare</span></div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="font-medium text-[0.95rem] text-primary border-b-2 border-primary pb-1">Home</a>
            <a href="#" className="font-medium text-[0.95rem] transition-colors hover:text-primary">Services</a>
            <a href="#" className="font-medium text-[0.95rem] transition-colors hover:text-primary">Doctors</a>
            <a href="#" className="font-medium text-[0.95rem] transition-colors hover:text-primary">About</a>
            <a href="#" className="font-medium text-[0.95rem] transition-colors hover:text-primary">Contact</a></nav>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="font-semibold text-primary">Login</a>
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-primary-dark">
              Make Appointment</button></div></div></header>
      <main className="flex-1">
        <section className="bg-hero-gradient pt-20 pb-40 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="flex-1 text-white z-10">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                Your Health, Our Global Priority.</h1>
              <p className="text-white/90 text-lg mb-8 max-w-lg">
                Leading-edge hospital management designed for modern clinical excellence. We unify patient care, administrative efficiency, and advanced medical expertise.</p>
           <div className="flex flex-wrap gap-4">
                <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-slate-100">
                  Book an Appointment</button>
                <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:bg-white/10">
                  View Services</button></div></div>
   <div className="flex-1 relative z-0 flex justify-end">
              <div className="relative">
                <img src="/1st image doctor.jpg" alt="Doctor smiling" className="rounded-3xl w-full max-w-[480px] shadow-2xl object-cover" />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 md:p-6 rounded-2xl flex items-center gap-4 shadow-xl text-slate-800">
                  <div className="bg-cyan-50 text-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Users size={20} /></div>
                  <div>
                    <strong className="block text-xl font-bold">5,000+</strong>
                    <span className="text-sm text-slate-500">Patients Served</span></div></div></div></div></div></section>
      <section className="-mt-24 relative z-20 pb-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <BriefcaseMedical size={24} /></div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Qualified Doctors</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[80px]">Our medical team consists of board-certified specialists committed to providing evidence-based treatments and compassionate patient care.</p>
                <a href="#" className="text-primary font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">Meet the team &rarr;</a></div>
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Helicopter size={24} /></div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Emergency Helicopter</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[80px]">Critical minutes save lives. Our rapid air ambulance service provides swift transportation for urgent trauma and high-risk medical transfers.</p>
                <a href="#" className="text-primary font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">Response times &rarr;</a></div>
         <div className="bg-white rounded-2xl p-8 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Info size={24} /></div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Covid-19 Information</h3>
                <p className="text-slate-500 text-sm mb-6 min-h-[80px]">Stay informed with the latest vaccination updates, testing protocols, and safety guidelines from our clinical health department.</p>
                <a href="#" className="text-primary font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">Latest updates &rarr;</a></div></div></div></section>
      <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 block">OUR SPECIALIZATIONS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 relative inline-block">
                Modern Healthcare Management
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary"></span></h2></div>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 flex flex-col gap-8">
                <div className="flex gap-6">
                  <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Activity size={24} /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Precision Diagnostics</h3>
                    <p className="text-slate-500 text-[0.95rem]">Utilizing AI-driven tools to identify health issues with unprecedented clinical accuracy.</p></div></div>
                 <div className="flex gap-6">
                  <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <Stethoscope size={24} /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Patient Monitoring</h3>
                    <p className="text-slate-500 text-[0.95rem]">Real-time health tracking systems ensuring proactive intervention for chronic conditions.</p></div></div>
                 <div className="flex gap-6">
                  <div className="bg-cyan-50 text-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Secure Records</h3>
                    <p className="text-slate-500 text-[0.95rem]">Cloud-native infrastructure protecting patient data with military-grade encryption.</p></div></div></div>          
              <div className="flex-1">
                <img src="/hospital area.jpg" alt="Modern hospital area" className="w-full rounded-2xl shadow-xl object-cover" /></div></div></div></section></main>
      <footer className="bg-[#0b5fb4] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                <BriefcaseMedical size={24} />
                <span>AxisCare</span></div>
              <p className="text-white/80 text-[0.9rem] mb-6 max-w-xs">
                Revolutionizing healthcare management through professional excellence and clinical precision.</p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Globe size={18} /></a>
                <a href="#" className="bg-white/10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"><Share2 size={18} /></a></div></div>
               <div className="lg:col-span-1">
              <h4 className="text-[1.1rem] font-semibold mb-6">Company</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Career Opportunities</a></li></ul></div>         
            <div className="lg:col-span-1">
              <h4 className="text-[1.1rem] font-semibold mb-6">Patients</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Emergency Care</a></li>
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Patient Portal</a></li>
                <li><a href="#" className="text-white/80 text-[0.9rem] hover:text-white transition-colors">Insurance Partners</a></li></ul></div>
           <div className="lg:col-span-2">
              <h4 className="text-[1.1rem] font-semibold mb-6">Stay Informed</h4>
              <p className="text-white/80 text-[0.9rem] mb-4">Receive monthly health tips and hospital updates.</p>
              <form className="flex mt-2">
                <input type="email" placeholder="Your email" className="px-4 py-3 bg-black/10 border border-white/20 rounded-l-md text-white placeholder-white/60 focus:outline-none w-full" />
                <button type="submit" className="bg-primary px-4 rounded-r-md flex items-center justify-center">
                  <Send size={18} /></button></form></div></div>
             <div className="border-t border-white/10 pt-6 text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} AxisCare Hospital Management. All rights reserved. Professional healthcare solutions for a global future.</div></div></footer></div>
  );
}
