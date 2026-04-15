import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/chatStore";
import { getSocket } from "../../lib/socket";
import MessageBubble from "./MessageBubble";
import Spinner from "../ui/Spinner";
import type { Conversation, Message } from "../../types";

interface Props {
  conversation: Conversation;
  currentUserId: string;
}

const MessageList: React.FC<Props> = ({ conversation, currentUserId }) => {
  const { messages, isLoadingMessages } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const convMessages = messages[conversation._id] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convMessages.length]);

  // Mark as read when conversation opens
  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.emit("messages:read", { conversationId: conversation._id });
    }
  }, [conversation._id, convMessages.length]);

  if (isLoadingMessages && convMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  convMessages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 relative z-10">
      {convMessages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="bg-[#1a2236] text-[#8696a0] text-xs px-4 py-2 rounded-lg border border-[#1e2d45]">
            No messages yet. Say hello! 👋
          </div>
        </div>
      )}

      {groupedMessages.map((group) => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <span className="bg-[#1a2236] text-[#8696a0] text-xs px-3 py-1 rounded-full border border-[#1e2d45]">
              {group.date}
            </span>
          </div>

          {group.messages.map((msg, idx) => {
            const isSent = msg.sender._id === currentUserId;
            const showAvatar =
              conversation.isGroup &&
              !isSent &&
              (idx === group.messages.length - 1 ||
                group.messages[idx + 1]?.sender._id !== msg.sender._id);

            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                isSent={isSent}
                isGroup={conversation.isGroup}
                showAvatar={showAvatar}
                onReply={() => setReplyTo(msg)}
              />
            );
          })}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
