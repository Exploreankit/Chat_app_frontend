import React from "react";
import { useChatStore } from "../../store/chatStore";
import Avatar from "../ui/Avatar";
import type { Conversation } from "../../types";

interface Props {
  conversation: Conversation;
  currentUserId: string;
}

const ChatHeader: React.FC<Props> = ({ conversation, currentUserId }) => {
  const { onlineUsers, typingUsers } = useChatStore();

  const otherParticipant = conversation.isGroup
    ? null
    : conversation.participants.find((p) => p._id !== currentUserId);

  const displayName = conversation.isGroup
    ? conversation.groupName || "Group"
    : otherParticipant?.username || "Unknown";

  const avatar = conversation.isGroup
    ? conversation.groupAvatar
    : otherParticipant?.avatar;

  const isOnline = !conversation.isGroup && otherParticipant
    ? onlineUsers.has(otherParticipant._id)
    : false;

  const typingInConv = typingUsers.filter(
    (t) => t.conversationId === conversation._id && t.userId !== currentUserId
  );

  const statusText = typingInConv.length > 0
    ? conversation.isGroup
      ? `${typingInConv.map((t) => t.username).join(", ")} typing...`
      : "typing..."
    : conversation.isGroup
    ? `${conversation.participants.length} members`
    : isOnline
    ? "online"
    : otherParticipant?.lastSeen
    ? `last seen ${new Date(otherParticipant.lastSeen).toLocaleDateString()}`
    : "offline";

  return (
    <div className="relative z-10 flex items-center gap-3 px-4 py-3 bg-[#161b27] border-b border-[#1e2d45]">
      <Avatar
        src={avatar}
        name={displayName}
        size="md"
        isOnline={!conversation.isGroup ? isOnline : undefined}
      />
      <div className="flex-1 min-w-0">
        <h2 className="text-[#e9edef] font-medium text-sm truncate">{displayName}</h2>
        <p
          className={`text-xs truncate ${
            typingInConv.length > 0 ? "text-[#4f8ef7]" : "text-[#8696a0]"
          }`}
        >
          {statusText}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          title="Search"
          className="p-2 rounded-full hover:bg-[#1e2d45] text-[#aebac1] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          title="More options"
          className="p-2 rounded-full hover:bg-[#1e2d45] text-[#aebac1] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
