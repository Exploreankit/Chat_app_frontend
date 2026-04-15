import React, { useState } from "react";
import { format } from "date-fns";
import { useChatStore } from "../../store/chatStore";
import { getSocket } from "../../lib/socket";
import Avatar from "../ui/Avatar";
import type { Message } from "../../types";

interface Props {
  message: Message;
  isSent: boolean;
  isGroup: boolean;
  showAvatar: boolean;
  onReply: () => void;
}

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageBubble: React.FC<Props> = ({
  message,
  isSent,
  isGroup,
  showAvatar,
  onReply,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const { deleteMessage } = useChatStore();

  const handleDelete = () => {
    const socket = getSocket();
    socket?.emit("message:delete", { messageId: message._id });
    deleteMessage(message._id, message.conversationId);
    setShowActions(false);
  };

  const handleReact = (emoji: string) => {
    const socket = getSocket();
    socket?.emit("message:react", { messageId: message._id, emoji });
    setShowReactions(false);
    setShowActions(false);
  };

  const timeStr = format(new Date(message.createdAt), "HH:mm");

  const isRead = message.readBy && message.readBy.length > 0;

  return (
    <div
      className={`flex items-end gap-2 mb-1 group ${isSent ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowReactions(false); }}
    >
      {/* Avatar for group chats */}
      {isGroup && !isSent && (
        <div className="w-8 flex-shrink-0">
          {showAvatar && (
            <Avatar
              src={message.sender.avatar}
              name={message.sender.username}
              size="sm"
            />
          )}
        </div>
      )}

      <div className={`max-w-[65%] ${isSent ? "message-sent" : "message-received"}`}>
        {/* Reply preview */}
        {message.replyTo && !message.isDeleted && (
          <div
            className={`mb-1 px-3 py-2 rounded-lg border-l-4 border-[#4f8ef7] text-xs text-[#8696a0] ${
              isSent ? "bg-[#1a2a4a]" : "bg-[#1a2236]"
            }`}
          >
            <p className="text-[#4f8ef7] font-medium mb-0.5">
              {(message.replyTo as Message).sender?.username}
            </p>
            <p className="truncate">{(message.replyTo as Message).content}</p>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-3 py-2 rounded-lg shadow-sm ${
            isSent
              ? "rounded-tr-none text-[#e9edef]"
              : "bg-[#161b27] text-[#e9edef] rounded-tl-none border border-[#1e2d45]"
          } ${message.isDeleted ? "opacity-60 italic" : ""}`}
          style={isSent ? { background: "linear-gradient(135deg, #1e3a6e, #2d2b6e)" } : {}}
        >
          {/* Sender name in group */}
          {isGroup && !isSent && !message.isDeleted && (
            <p className="text-[#4f8ef7] text-xs font-medium mb-1">
              {message.sender.username}
            </p>
          )}

          {/* Content */}
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Time + read receipt */}
          <div className={`flex items-center gap-1 mt-1 ${isSent ? "justify-end" : "justify-end"}`}>
            <span className="text-[10px] text-[#8696a0]">{timeStr}</span>
            {isSent && !message.isDeleted && (
              <svg
                className={`w-3.5 h-3.5 ${isRead ? "text-[#53bdeb]" : "text-[#8696a0]"}`}
                viewBox="0 0 16 11"
                fill="currentColor"
              >
                <path d="M11.071.653a.45.45 0 0 0-.63 0L4.5 6.595 2.559 4.653a.45.45 0 0 0-.63.63l2.256 2.256a.45.45 0 0 0 .63 0l6.256-6.256a.45.45 0 0 0 0-.63z" />
                <path d="M15.071.653a.45.45 0 0 0-.63 0L8.5 6.595l-.944-.944a.45.45 0 0 0-.63.63l1.259 1.259a.45.45 0 0 0 .63 0l6.256-6.256a.45.45 0 0 0 0-.63z" />
              </svg>
            )}
          </div>
        </div>

        {/* Reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isSent ? "justify-end" : "justify-start"}`}>
            {Object.entries(
              message.reactions.reduce((acc: Record<string, number>, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="bg-[#1a2236] hover:bg-[#1e2d45] text-xs px-2 py-0.5 rounded-full border border-[#1e2d45] transition-colors"
              >
                {emoji} {count > 1 && count}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {showActions && !message.isDeleted && (
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSent ? "flex-row-reverse" : ""}`}>
          {/* React */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="p-1.5 rounded-full bg-[#161b27] hover:bg-[#1e2d45] text-[#8696a0] hover:text-white transition-colors"
              title="React"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showReactions && (
              <div className={`absolute bottom-8 ${isSent ? "right-0" : "left-0"} bg-[#161b27] rounded-full px-2 py-1.5 flex gap-1 shadow-xl z-50 border border-[#1e2d45]`}>
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply */}
          <button
            onClick={onReply}
            className="p-1.5 rounded-full bg-[#161b27] hover:bg-[#1e2d45] text-[#8696a0] hover:text-white transition-colors"
            title="Reply"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>

          {/* Delete (own messages only) */}
          {isSent && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-full bg-[#161b27] hover:bg-red-500/20 text-[#8696a0] hover:text-red-400 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
