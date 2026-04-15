import { useEffect } from "react";
import { getSocket, connectSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import type { Message } from "../types";

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
    fetchConversations,
  } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectSocket(token);

    socket.on("message:new", ({ message }: { message: Message }) => {
      addMessage(message);
      updateConversationLastMessage(message.conversationId, message);
    });

    socket.on(
      "message:deleted",
      ({
        messageId,
        conversationId,
      }: {
        messageId: string;
        conversationId: string;
      }) => {
        deleteMessage(messageId, conversationId);
      }
    );

    socket.on(
      "message:reacted",
      ({ messageId, reactions }: { messageId: string; reactions: any[] }) => {
        updateMessageReactions(messageId, reactions);
      }
    );

    socket.on("typing:start", (data) => {
      setTypingUser(data);
    });

    socket.on(
      "typing:stop",
      ({
        userId,
        conversationId,
      }: {
        userId: string;
        conversationId: string;
      }) => {
        removeTypingUser(userId, conversationId);
      }
    );

    socket.on("user:online", ({ userId }: { userId: string }) => {
      setUserOnline(userId);
    });

    socket.on("user:offline", ({ userId }: { userId: string }) => {
      setUserOffline(userId);
    });

    socket.on("users:online", ({ userIds }: { userIds: string[] }) => {
      setOnlineUsers(userIds);
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
    };
  }, [isAuthenticated, token]);
};
