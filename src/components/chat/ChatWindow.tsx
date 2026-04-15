import React from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-8"
    style={{ background: "linear-gradient(145deg, #0d1117, #111827)" }}>
    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
      style={{ background: "linear-gradient(135deg, #1a2236, #1e2a45)", border: "1px solid rgba(79,142,247,0.15)" }}>
      {/* Syncly dual-bubble icon */}
      <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
        <defs>
          <linearGradient id="emptyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f8ef7" />
            <stop offset="100%" stopColor="#6c63ff" />
          </linearGradient>
          <linearGradient id="emptyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06d6a0" />
            <stop offset="100%" stopColor="#4f8ef7" />
          </linearGradient>
        </defs>
        <path d="M44 14 C54 14 62 21 62 30 C62 39 54 46 44 46 L42 46 L38 52 L36 46 C30 45 25 41 23 36 C26 37 29 38 33 38 C43 38 51 31 51 22 C51 19 50 16 48 14 Z" fill="url(#emptyGrad2)" opacity="0.8"/>
        <path d="M28 8 C40 8 50 16 50 26 C50 36 40 44 28 44 L25 44 L20 52 L18 44 C10 42 4 35 4 26 C4 16 14 8 28 8 Z" fill="url(#emptyGrad1)"/>
        <circle cx="20" cy="26" r="2.5" fill="white"/>
        <circle cx="28" cy="26" r="2.5" fill="white"/>
        <circle cx="36" cy="26" r="2.5" fill="white"/>
      </svg>
    </div>
    <h2 className="text-2xl font-bold mb-1"
      style={{ background: "linear-gradient(135deg, #4f8ef7, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      Syncly
    </h2>
    <p className="text-[#8696a0] text-xs tracking-widest uppercase mb-4">Chat · Connect · Sync</p>
    <p className="text-[#8696a0] text-sm max-w-xs leading-relaxed">
      Select a conversation or start a new one to begin messaging.
    </p>
    <div className="mt-8 flex items-center gap-2 text-[#4a5568] text-xs">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      End-to-end encrypted
    </div>
  </div>
);

const ChatWindow: React.FC = () => {
  const { activeConversation } = useChatStore();
  const { user } = useAuthStore();

  if (!activeConversation) return <EmptyState />;

  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(145deg, #0d1117, #0f1520)" }}>
      {/* Chat background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <ChatHeader conversation={activeConversation} currentUserId={user?._id || ""} />
      <MessageList conversation={activeConversation} currentUserId={user?._id || ""} />
      <MessageInput conversation={activeConversation} />
    </div>
  );
};

export default ChatWindow;
