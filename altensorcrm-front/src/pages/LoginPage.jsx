import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import altensorLogo from '../assets/Altensor-Logo.png';
import crmHeroPreview from '../assets/crm_hero_preview.png';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@altensor.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    console.log('Test Login Successful:', { email, password });
    localStorage.setItem('token', 'demo-test-token');
    localStorage.setItem('currentUser', JSON.stringify({ username: 'Administrator', email, role: 'Admin' }));
    // Navigate directly to Enterprise Workspace desktop page for easy testing
    navigate('/desktop');
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased h-screen w-screen overflow-hidden flex font-body-md">
      {/* Left Side: Ambient Branding & Dashboard Preview */}
      <div className="hidden lg:flex lg:w-1/2 mesh-gradient relative items-center justify-center p-xxl overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiAvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iI2YxZjVmOSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="z-10 w-full max-w-xl flex flex-col items-start gap-xl">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-3 border border-indigo-200">
              ✨ Altensor CRM v2.0
            </span>
            <h1 className="font-display text-display text-on-surface w-[90%] leading-tight tracking-tighter text-3xl font-extrabold text-[#0F172A]">
              Welcome to Altensor — Elevate your workflow
            </h1>
            <p className="text-slate-600 mt-2 text-sm max-w-md">
              İş proseslərinizi, müştəri münasibətlərinizi və satış analitikanızı tək bir ağıllı platformada idarə edin.
            </p>
          </div>

          {/* Interactive Frost Card Mockup with CRM Graphic */}
          <div className="relative w-full rounded-[24px] border border-outline-variant/30 bg-white/60 backdrop-blur-xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.12)] overflow-hidden p-3 transition-transform duration-500 hover:scale-[1.01]">
            <div className="relative w-full rounded-xl overflow-hidden shadow-inner border border-white/60">
              <img
                src={crmHeroPreview}
                alt="Altensor CRM Dashboard Preview"
                className="w-full h-auto object-cover rounded-xl shadow-md"
              />
              
              {/* Floating Stat Badges */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/80 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  ↑
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Aylıq Satış</div>
                  <div className="text-sm font-extrabold text-slate-900">+38.4% 📈</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <div>
                  <div className="text-[11px] font-medium text-slate-300">Aktiv Müştərilər</div>
                  <div className="text-sm font-bold">2,450+ Lider</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-lg lg:p-xxl bg-surface-container-lowest">
        <div className="w-full max-w-[420px] flex flex-col gap-xl">
          {/* Branding Header */}
          <div className="flex flex-col gap-sm">
            <div className="mb-md">
              <img src={altensorLogo} alt="Altensor Logo" className="h-12 w-auto object-contain" />
            </div>
            <h2 className="font-headline-lg text-headline-lg text-[#0F172A] mb-xs">Welcome back</h2>
            <p className="font-body-md text-body-md text-[#64748B]">Please enter your details to sign in.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-lg w-full">
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant sr-only" htmlFor="email">
                Email
              </label>
              <div className="relative flex items-center h-14 rounded-xl input-border bg-white transition-all duration-200">
                <span className="material-symbols-outlined absolute left-md text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
                  mail
                </span>
                <input
                  className="w-full h-full pl-12 pr-md bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant outline-none"
                  id="email"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center w-full">
                <label className="font-label-sm text-label-sm text-on-surface-variant sr-only" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative flex items-center h-14 rounded-xl input-border bg-white transition-all duration-200">
                <span className="material-symbols-outlined absolute left-md text-outline-variant" style={{ fontVariationSettings: "'FILL' 0" }}>
                  lock
                </span>
                <input
                  className="w-full h-full pl-12 pr-12 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant outline-none"
                  id="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-md text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="flex justify-end mt-xs">
                <a className="font-label-sm text-label-sm text-[#4F46E5] hover:text-[#3730A3] transition-colors font-medium" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-md mt-sm">
              <button
                className="h-14 w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full font-label-sm text-label-sm font-bold shadow-[0_4px_14px_0_rgba(15,23,42,0.15)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.2)] transition-all duration-300 cursor-pointer"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
