import React, { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const SessionExpiredModal: React.FC = () => {
  const { sessionExpired, setSessionExpired } = useAuthStore();

  // Listen for the custom event fired by the API interceptor
  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener("session-expired", handler);
    return () => window.removeEventListener("session-expired", handler);
  }, [setSessionExpired]);

  if (!sessionExpired) return null;

  const handleLoginAgain = () => {
    setSessionExpired(false);
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-expired-title"
    >
      <div className="bg-[#1f2c34] rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5 border border-white/10">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#00a884]/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-[#00a884]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2
            id="session-expired-title"
            className="text-white text-xl font-semibold mb-2"
          >
            Session Expired
          </h2>
          <p className="text-[#8696a0] text-sm leading-relaxed">
            Your session has expired for security reasons. Please log in again
            to continue.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleLoginAgain}
          className="w-full py-3 rounded-xl bg-[#00a884] hover:bg-[#00c49a] active:bg-[#009070] text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#00a884] focus:ring-offset-2 focus:ring-offset-[#1f2c34]"
        >
          Log in again
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
