import { useEffect } from "react";
import { getSocket, connectSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Conversation, Message } from "../types";

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const {
    addMessage,
    deleteMessage,
    setTypingUser,
    removeTypingUser,
    setUserOnline,
    setUserOffline,
    setOnlineUsers,
    updateConversationLastMessage,
    updateMessageReactions,
    upsertConversation,
  } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectSocket(token);

    // New message received
    socket.on("message:new", ({ message }: { message: Message }) => {
      addMessage(message);
      updateConversationLastMessage(message.conversationId, message);
    });

    // Message deleted
    socket.on(
      "message:deleted",
      ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
        deleteMessage(messageId, conversationId);
      }
    );

    // Message reaction updated
    socket.on(
      "message:reacted",
      ({ messageId, reactions }: { messageId: string; reactions: any[] }) => {
        updateMessageReactions(messageId, reactions);
      }
    );

    // Typing indicators
    socket.on("typing:start", (data) => setTypingUser(data));
    socket.on(
      "typing:stop",
      ({ userId, conversationId }: { userId: string; conversationId: string }) => {
        removeTypingUser(userId, conversationId);
      }
    );

    // Presence
    socket.on("user:online", ({ userId }: { userId: string }) => setUserOnline(userId));
    socket.on("user:offline", ({ userId }: { userId: string }) => setUserOffline(userId));
    socket.on("users:online", ({ userIds }: { userIds: string[] }) => setOnlineUsers(userIds));

    // A new conversation was created — add it to sidebar for all participants
    socket.on("conversation:new", ({ conversation }: { conversation: Conversation }) => {
      upsertConversation(conversation);
    });

    // Conversation metadata updated (e.g. lastMessage changed)
    socket.on("conversation:updated", ({ conversation }: { conversation: Conversation }) => {
      upsertConversation(conversation);
    });

    return () => {
      socket.off("message:new");
      socket.off("message:deleted");
      socket.off("message:reacted");
      socket.off("typing:start");
      socket.off("typing:stop");
      socket.off("user:online");
      socket.off("user:offline");
      socket.off("users:online");
      socket.off("conversation:new");
      socket.off("conversation:updated");
    };
  }, [isAuthenticated, token]);
};
