import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "../../store/chatStore";
import Avatar from "../ui/Avatar";
import type { Conversation } from "../../types";

interface Props {
  conversation: Conversation;
  currentUserId: string;
}

const ConversationItem: React.FC<Props> = ({ conversation, currentUserId }) => {
  const { activeConversation, setActiveConversation, fetchMessages, onlineUsers } =
    useChatStore();

  const isActive = activeConversation?._id === conversation._id;

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

  const lastMsg = conversation.lastMessage;
  const lastMsgText = lastMsg
    ? lastMsg.isDeleted
      ? "This message was deleted"
      : lastMsg.type === "image"
      ? "📷 Photo"
      : lastMsg.type === "file"
      ? "📎 File"
      : lastMsg.content
    : "No messages yet";

  const lastMsgTime = lastMsg
    ? formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })
    : "";

  const handleClick = () => {
    setActiveConversation(conversation);
    fetchMessages(conversation._id);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#161b27] transition-colors text-left ${
        isActive ? "bg-[#1a2236] border-l-2 border-[#4f8ef7]" : ""
      }`}
    >
      <Avatar
        src={avatar}
        name={displayName}
        size="md"
        isOnline={!conversation.isGroup ? isOnline : undefined}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[#e9edef] text-sm font-medium truncate">
            {displayName}
          </span>
          {lastMsgTime && (
            <span className="text-[#8696a0] text-xs flex-shrink-0 ml-2">
              {lastMsgTime}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[#8696a0] text-xs truncate flex-1">
            {lastMsg?.sender?._id === currentUserId && !lastMsg?.isDeleted && (
              <span className="mr-1">You:</span>
            )}
            {lastMsgText}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
