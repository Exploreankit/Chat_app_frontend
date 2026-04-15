import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import Avatar from "../ui/Avatar";

interface Props {
  onClose: () => void;
}

const ProfileModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [status, setStatus] = useState(user?.status || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ username, status, avatar });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#161b27] rounded-2xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden border border-[#1e2d45]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45]">
          <h2 className="text-white font-semibold">Profile</h2>
          <button onClick={onClose} className="text-[#8696a0] hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar src={avatar || user?.avatar} name={username || "U"} size="xl" />
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL (optional)"
              className="w-full bg-[#0d1117] text-white placeholder-[#8696a0] rounded-lg px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-[#4f8ef7] border border-[#1e2d45]"
            />
          </div>

          <div>
            <label className="block text-[#8696a0] text-xs font-medium mb-2 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0d1117] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] border border-[#1e2d45]"
            />
          </div>

          <div>
            <label className="block text-[#8696a0] text-xs font-medium mb-2 uppercase tracking-wide">
              Status
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              maxLength={100}
              className="w-full bg-[#0d1117] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] border border-[#1e2d45]"
            />
          </div>

          <div>
            <label className="block text-[#8696a0] text-xs font-medium mb-1 uppercase tracking-wide">
              Email
            </label>
            <p className="text-[#8696a0] text-sm">{user?.email}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-all text-sm"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6c63ff)" }}
          >
            {saved ? "✓ Saved!" : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
