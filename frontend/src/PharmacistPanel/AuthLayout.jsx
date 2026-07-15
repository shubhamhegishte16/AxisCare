import React from "react";

import loginIllustration from "../assets/pharmacist/illustrations/login-security-shield.png";
import registerIllustration from "../assets/pharmacist/illustrations/register-clipboard-shield.png";
import forgotIllustration from "../assets/pharmacist/illustrations/forgot-password-envelope.png";
import resetIllustration from "../assets/pharmacist/illustrations/reset-password-lock.png";

const illustrations = {
  login: loginIllustration,
  register: registerIllustration,
  forgot: forgotIllustration,
  reset: resetIllustration,
};

const AuthLayout = ({ illustration = "login", children }) => {
  const image = illustrations[illustration] || loginIllustration;

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

          <img
            src={image}
            alt="Authentication Illustration"
            className="mt-12 w-[520px] max-w-full object-contain select-none"
            draggable={false}
          />
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

export default AuthLayout;