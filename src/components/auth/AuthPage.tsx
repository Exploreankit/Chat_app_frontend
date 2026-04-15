import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const SynclyLogo: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="authGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f8ef7" />
        <stop offset="100%" stopColor="#6c63ff" />
      </linearGradient>
      <linearGradient id="authGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06d6a0" />
        <stop offset="100%" stopColor="#4f8ef7" />
      </linearGradient>
    </defs>
    {/* Back bubble */}
    <path
      d="M44 14 C54 14 62 21 62 30 C62 39 54 46 44 46 L42 46 L38 52 L36 46 C30 45 25 41 23 36 C26 37 29 38 33 38 C43 38 51 31 51 22 C51 19 50 16 48 14 Z"
      fill="url(#authGrad2)"
      opacity="0.9"
    />
    {/* Front bubble */}
    <path
      d="M28 8 C40 8 50 16 50 26 C50 36 40 44 28 44 L25 44 L20 52 L18 44 C10 42 4 35 4 26 C4 16 14 8 28 8 Z"
      fill="url(#authGrad1)"
    />
    <circle cx="20" cy="26" r="2.5" fill="white" />
    <circle cx="28" cy="26" r="2.5" fill="white" />
    <circle cx="36" cy="26" r="2.5" fill="white" />
  </svg>
);

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #4f8ef7, #6c63ff)" }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #06d6a0, #4f8ef7)" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl mb-5"
            style={{ background: "linear-gradient(135deg, #1a2236 0%, #1e2a45 100%)", border: "1px solid rgba(79,142,247,0.2)" }}>
            <SynclyLogo size={52} />
          </div>

          {/* Wordmark */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-4xl font-bold tracking-tight"
              style={{ background: "linear-gradient(135deg, #4f8ef7, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Syncly
            </span>
          </div>
          <p className="text-[#8696a0] text-sm tracking-widest uppercase font-medium">
            Chat &bull; Connect &bull; Sync
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(145deg, #161b27, #1a2236)", border: "1px solid rgba(79,142,247,0.12)" }}>
          {/* Tabs */}
          <div className="flex border-b border-[#1e2d45]">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                mode === "login"
                  ? "text-white border-b-2 border-[#4f8ef7]"
                  : "text-[#8696a0] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                mode === "register"
                  ? "text-white border-b-2 border-[#4f8ef7]"
                  : "text-[#8696a0] hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {mode === "login" ? (
              <LoginForm />
            ) : (
              <RegisterForm onSuccess={() => setMode("login")} />
            )}
          </div>
        </div>

        {/* Footer tagline */}
        <p className="text-center text-[#4a5568] text-xs mt-6">
          Secure · Real-time · End-to-end
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
