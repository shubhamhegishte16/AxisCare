import React from 'react';
import { getRoleConfig } from './roleConfig';

const RoleAuthLayout = ({ role, children }) => {
  const { label, icon: Icon } = getRoleConfig(role);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 via-blue-50 to-blue-100">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <h1 className="text-5xl font-extrabold tracking-tight">
            <span className="text-cyan-500">Axis</span>
            <span className="text-blue-700">Care</span>
          </h1>

          <p className="mt-3 text-blue-600 text-lg font-medium">
            Smart Hospital Management System
          </p>

          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center justify-center w-40 h-40 rounded-full bg-white shadow-xl">
              <Icon className="w-20 h-20 text-[#2f6fe0]" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-bold text-blue-800">{label} Portal</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 p-8">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-extrabold">
              <span className="text-cyan-500">Axis</span>
              <span className="text-blue-700">Care</span>
            </h1>

            <p className="mt-2 text-blue-600">
              Smart Hospital Management System
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default RoleAuthLayout;
