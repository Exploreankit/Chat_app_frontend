import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";

interface Props {
  onSuccess: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(form.username, form.email, form.password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {[
        { name: "username", label: "Username", type: "text", placeholder: "johndoe" },
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
        { name: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-[#8696a0] text-xs font-medium mb-2 uppercase tracking-wide">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            placeholder={field.placeholder}
            required
            className="w-full bg-[#0d1117] text-white placeholder-[#8696a0] rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] transition border border-[#1e2d45]"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all text-sm mt-2"
        style={{ background: isLoading ? "#2a3942" : "linear-gradient(135deg, #4f8ef7, #6c63ff)" }}
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
