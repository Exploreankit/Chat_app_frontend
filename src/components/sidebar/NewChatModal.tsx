import React, { useState, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import Avatar from "../ui/Avatar";
import type { User } from "../../types";
import { getSocket } from "../../lib/socket";

interface Props {
  onClose: () => void;
}

const NewChatModal: React.FC<Props> = ({ onClose }) => {
  const { searchUsers, searchResults, clearSearch, createConversation, createGroupConversation, setActiveConversation, fetchMessages } = useChatStore();
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"dm" | "group">("dm");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) searchUsers(query);
      else clearSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    return () => clearSearch();
  }, []);

  const handleSelectUser = (u: User) => {
    if (mode === "dm") {
      handleCreateDM(u._id);
    } else {
      if (!selectedUsers.find((s) => s._id === u._id)) {
        setSelectedUsers([...selectedUsers, u]);
      }
    }
  };

  const handleCreateDM = async (participantId: string) => {
    setIsCreating(true);
    try {
      const conv = await createConversation(participantId);
      setActiveConversation(conv);
      fetchMessages(conv._id);
      const socket = getSocket();
      // Join room locally and notify server to push to other participant
      socket?.emit("conversation:join", conv._id);
      socket?.emit("conversation:created", { conversationId: conv._id });
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2 || !groupName.trim()) return;
    setIsCreating(true);
    try {
      const conv = await createGroupConversation(
        selectedUsers.map((u) => u._id),
        groupName
      );
      setActiveConversation(conv);
      fetchMessages(conv._id);
      const socket = getSocket();
      socket?.emit("conversation:join", conv._id);
      socket?.emit("conversation:created", { conversationId: conv._id });
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#161b27] rounded-2xl w-full max-w-md mx-4 shadow-2xl overflow-hidden border border-[#1e2d45]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45]">
          <h2 className="text-white font-semibold">New Conversation</h2>
          <button onClick={onClose} className="text-[#8696a0] hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex px-5 pt-4 gap-2">
          <button
            onClick={() => { setMode("dm"); setSelectedUsers([]); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "dm"
                ? "text-white"
                : "bg-[#0d1117] text-[#8696a0] hover:text-white"
            }`}
            style={mode === "dm" ? { background: "linear-gradient(135deg, #4f8ef7, #6c63ff)" } : {}}
          >
            Direct Message
          </button>
          <button
            onClick={() => setMode("group")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "group"
                ? "text-white"
                : "bg-[#0d1117] text-[#8696a0] hover:text-white"
            }`}
            style={mode === "group" ? { background: "linear-gradient(135deg, #4f8ef7, #6c63ff)" } : {}}
          >
            New Group
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Group name input */}
          {mode === "group" && (
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full bg-[#0d1117] text-white placeholder-[#8696a0] rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4f8ef7] border border-[#1e2d45]"
            />
          )}

          {/* Selected users chips */}
          {mode === "group" && selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((u) => (
                <span
                  key={u._id}
                  className="flex items-center gap-1.5 bg-[#4f8ef7]/20 text-[#4f8ef7] text-xs px-3 py-1.5 rounded-full"
                >
                  {u.username}
                  <button
                    onClick={() => setSelectedUsers(selectedUsers.filter((s) => s._id !== u._id))}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="flex items-center bg-[#0d1117] rounded-lg px-3 gap-2 border border-[#1e2d45]">
            <svg className="w-4 h-4 text-[#8696a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="flex-1 bg-transparent text-white placeholder-[#8696a0] text-sm py-2.5 outline-none"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-60 overflow-y-auto space-y-1">
            {searchResults.length === 0 && query && (
              <p className="text-[#8696a0] text-sm text-center py-4">No users found</p>
            )}
            {searchResults.map((u) => (
              <button
                key={u._id}
                onClick={() => handleSelectUser(u)}
                disabled={isCreating}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a2236] transition-colors text-left"
              >
                <Avatar src={u.avatar} name={u.username} size="sm" />
                <div>
                  <p className="text-white text-sm font-medium">{u.username}</p>
                  <p className="text-[#8696a0] text-xs">{u.email}</p>
                </div>
                {mode === "group" && selectedUsers.find((s) => s._id === u._id) && (
                  <svg className="w-4 h-4 text-[#4f8ef7] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Create group button */}
          {mode === "group" && (
            <button
              onClick={handleCreateGroup}
              disabled={selectedUsers.length < 2 || !groupName.trim() || isCreating}
              className="w-full bg-[#00a884] hover:bg-[#06cf9c] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {isCreating ? "Creating..." : `Create Group (${selectedUsers.length} selected)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
