import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const SEED_USERS = [
  { label: "Alice", email: "alice@syncly.dev", password: "password123" },
  { label: "Bob",   email: "bob@syncly.dev",   password: "password123" },
  { label: "Charlie", email: "charlie@syncly.dev", password: "password123" },
];

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const fillCredentials = (seedEmail: string, seedPassword: string) => {
    setEmail(seedEmail);
    setPassword(seedPassword);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* ── Seed credentials ─────────────────────────────────────────────── */}
      <div className="rounded-lg border border-[#1e2d45] bg-[#0d1117]/60 p-3">
        <p className="text-[#8696a0] text-xs font-medium uppercase tracking-wide mb-2">
          🧪 Test accounts — click to fill
        </p>
        <div className="flex gap-2">
          {SEED_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => fillCredentials(u.email, u.password)}
              className="flex-1 py-1.5 rounded-md text-xs font-semibold border border-[#4f8ef7]/40 text-[#4f8ef7] hover:bg-[#4f8ef7]/10 active:bg-[#4f8ef7]/20 transition-colors"
            >
              {u.label}
            </button>
          ))}
        </div>
        <p className="text-[#8696a0]/60 text-[11px] mt-2 text-center">
          All accounts share password&nbsp;
          <span className="font-mono text-[#8696a0]">password123</span>
        </p>
      </div>

      <div>
        <label className="block text-[#8696a0] text-xs font-medium mb-2 uppercase tracking-wide">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full bg-[#0d1117] text-white placeholder-[#8696a0] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] transition border border-[#1e2d45]"
        />
      </div>

      <div>
        <label className="block text-[#8696a0] text-xs font-medium mb-2 uppercase tracking-wide">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-[#0d1117] text-white placeholder-[#8696a0] rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] transition border border-[#1e2d45]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8696a0] hover:text-white"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all text-sm btn-syncly"
        style={{ background: isLoading ? "#2a3942" : "linear-gradient(135deg, #4f8ef7, #6c63ff)" }}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
