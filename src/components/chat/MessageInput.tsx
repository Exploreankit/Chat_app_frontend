import React, { useState, useRef, useEffect, useCallback } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useChatStore } from "../../store/chatStore";
import { getSocket } from "../../lib/socket";
import type { Conversation, Message } from "../../types";

interface Props {
  conversation: Conversation;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

const MessageInput: React.FC<Props> = ({ conversation, replyTo, onCancelReply }) => {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const { sendMessage } = useChatStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversation._id]);

  const emitTypingStop = useCallback(() => {
    if (isTypingRef.current) {
      const socket = getSocket();
      socket?.emit("typing:stop", { conversationId: conversation._id });
      isTypingRef.current = false;
    }
  }, [conversation._id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    const socket = getSocket();
    if (!isTypingRef.current) {
      socket?.emit("typing:start", { conversationId: conversation._id });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(emitTypingStop, 2000);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    emitTypingStop();
    setText("");
    setShowEmoji(false);
    setIsSending(true);

    try {
      const socket = getSocket();
      socket?.emit("message:send", {
        conversationId: conversation._id,
        content: trimmed,
        replyTo: replyTo?._id,
      });
      onCancelReply?.();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  return (
    <div className="relative z-10 bg-[#161b27] px-4 py-3 border-t border-[#1e2d45]">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 bg-[#1a2236] rounded-lg px-3 py-2 border-l-4 border-[#4f8ef7]">
          <div className="flex-1 min-w-0">
            <p className="text-[#4f8ef7] text-xs font-medium">{replyTo.sender.username}</p>
            <p className="text-[#8696a0] text-xs truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-[#8696a0] hover:text-white flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <div className="relative">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 rounded-full hover:bg-[#1e2d45] text-[#8696a0] hover:text-[#aebac1] transition-colors flex-shrink-0"
            title="Emoji"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {showEmoji && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                width={320}
                height={400}
              />
            </div>
          )}
        </div>

        {/* Text input */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          rows={1}
          className="flex-1 bg-[#0d1117] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-2.5 text-sm outline-none resize-none max-h-[120px] leading-relaxed border border-[#1e2d45] focus:border-[#4f8ef7] transition-colors"
          style={{ scrollbarWidth: "none" }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending}
          className="p-2.5 rounded-full disabled:bg-[#1e2d45] disabled:text-[#8696a0] text-white transition-all flex-shrink-0"
          style={{ background: !text.trim() || isSending ? undefined : "linear-gradient(135deg, #4f8ef7, #6c63ff)" }}
          title="Send"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
          </svg>
        </button>
      </div>

      {/* Close emoji on outside click */}
      {showEmoji && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmoji(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;
