import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { connectSocket } from "./lib/socket";
import { useSocket } from "./hooks/useSocket";
import AuthPage from "./components/auth/AuthPage";
import ChatLayout from "./components/layout/ChatLayout";
import Spinner from "./components/ui/Spinner";
import SessionExpiredModal from "./components/ui/SessionExpiredModal";

const AppContent: React.FC = () => {
  useSocket();
  return (
    <Routes>
      <Route path="/" element={<ChatLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const { isAuthenticated, token, isLoading, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
      connectSocket(token);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111b21] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <>
      <AppContent />
      <SessionExpiredModal />
    </>
  );
};

export default App;
