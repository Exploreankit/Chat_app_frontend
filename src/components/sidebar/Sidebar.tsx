import React, { useEffect, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import ConversationList from "./ConversationList";
import SearchBar from "./SearchBar";
import NewChatModal from "./NewChatModal";
import ProfileModal from "./ProfileModal";
import Avatar from "../ui/Avatar";

const Sidebar: React.FC = () => {
  const { fetchConversations } = useChatStore();
  const { user, logout } = useAuthStore();
  const [showNewChat, setShowNewChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-r border-[#1e2d45]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b27]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfile(true)}
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar src={user?.avatar} name={user?.username || "U"} size="md" />
          </button>
          {/* Syncly wordmark */}
          <span className="text-base font-bold tracking-tight"
            style={{ background: "linear-gradient(135deg, #4f8ef7, #6c63ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Syncly
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewChat(true)}
            title="New chat"
            className="p-2 rounded-full hover:bg-[#1e2d45] text-[#aebac1] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              title="Menu"
              className="p-2 rounded-full hover:bg-[#1e2d45] text-[#aebac1] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-[#161b27] rounded-lg shadow-xl z-50 min-w-[160px] py-1 border border-[#1e2d45]">
                <button
                  onClick={() => { setShowProfile(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#d1d7db] hover:bg-[#1e2d45] transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => { logout(); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#d1d7db] hover:bg-[#1e2d45] transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Conversations */}
      <ConversationList />

      {/* Modals */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Close menu on outside click */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
