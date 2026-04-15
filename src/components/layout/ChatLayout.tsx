import React from "react";
import Sidebar from "../sidebar/Sidebar";
import ChatWindow from "../chat/ChatWindow";

const ChatLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117]">
      {/* Sidebar */}
      <div className="w-[380px] flex-shrink-0 flex flex-col">
        <Sidebar />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatLayout;
