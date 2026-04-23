import { create } from "zustand";
import api from "../lib/api";
import type { Conversation, Message, TypingUser } from "../types";

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>;
  typingUsers: TypingUser[];
  onlineUsers: Set<string>;
  searchResults: any[];
  isLoadingMessages: boolean;
  isLoadingConversations: boolean;

  // Actions
  fetchConversations: () => Promise<void>;
  setActiveConversation: (conv: Conversation | null) => void;
  fetchMessages: (conversationId: string, page?: number) => Promise<void>;
  sendMessage: (conversationId: string, content: string, replyTo?: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string, conversationId: string) => void;
  createConversation: (participantId: string) => Promise<Conversation>;
  createGroupConversation: (participantIds: string[], groupName: string) => Promise<Conversation>;
  searchUsers: (query: string) => Promise<void>;
  clearSearch: () => void;
  setTypingUser: (data: TypingUser) => void;
  removeTypingUser: (userId: string, conversationId: string) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setOnlineUsers: (userIds: string[]) => void;
  updateConversationLastMessage: (conversationId: string, message: Message) => void;
  updateMessageReactions: (messageId: string, reactions: any[]) => void;
  upsertConversation: (conversation: Conversation) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: [],
  onlineUsers: new Set(),
  searchResults: [],
  isLoadingMessages: false,
  isLoadingConversations: false,

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const { data } = await api.get("/conversations");
      set({ conversations: data.conversations, isLoadingConversations: false });
    } catch {
      set({ isLoadingConversations: false });
    }
  },

  setActiveConversation: (conv) => {
    set({ activeConversation: conv });
  },

  fetchMessages: async (conversationId, page = 1) => {
    set({ isLoadingMessages: true });
    try {
      const { data } = await api.get(`/messages/${conversationId}?page=${page}&limit=50`);
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]:
            page === 1
              ? data.messages
              : [...data.messages, ...(state.messages[conversationId] || [])],
        },
        isLoadingMessages: false,
      }));
    } catch {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (conversationId, content, replyTo) => {
    const { data } = await api.post(`/messages/${conversationId}`, {
      content,
      replyTo,
    });
    // Message will be added via socket event, but add optimistically too
    get().addMessage(data.message);
    get().updateConversationLastMessage(conversationId, data.message);
  },

  addMessage: (message) => {
    const convId = message.conversationId;
    set((state) => {
      const existing = state.messages[convId] || [];
      // Avoid duplicates
      if (existing.find((m) => m._id === message._id)) return state;
      return {
        messages: {
          ...state.messages,
          [convId]: [...existing, message],
        },
      };
    });
  },

  updateMessage: (messageId, updates) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId].map((m) =>
          m._id === messageId ? { ...m, ...updates } : m
        );
      }
      return { messages: newMessages };
    });
  },

  deleteMessage: (messageId, conversationId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map((m) =>
          m._id === messageId
            ? { ...m, isDeleted: true, content: "This message was deleted" }
            : m
        ),
      },
    }));
  },

  createConversation: async (participantId) => {
    const { data } = await api.post("/conversations", { participantId });
    set((state) => {
      const exists = state.conversations.find(
        (c) => c._id === data.conversation._id
      );
      if (!exists) {
        return { conversations: [data.conversation, ...state.conversations] };
      }
      return state;
    });
    return data.conversation;
  },

  createGroupConversation: async (participantIds, groupName) => {
    const { data } = await api.post("/conversations/group", {
      participantIds,
      groupName,
    });
    set((state) => ({
      conversations: [data.conversation, ...state.conversations],
    }));
    return data.conversation;
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    set({ searchResults: data.users });
  },

  clearSearch: () => set({ searchResults: [] }),

  setTypingUser: (data) => {
    set((state) => {
      const filtered = state.typingUsers.filter(
        (t) => !(t.userId === data.userId && t.conversationId === data.conversationId)
      );
      return { typingUsers: [...filtered, data] };
    });
  },

  removeTypingUser: (userId, conversationId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (t) => !(t.userId === userId && t.conversationId === conversationId)
      ),
    }));
  },

  setUserOnline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.add(userId);
      return { onlineUsers: next };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUsers);
      next.delete(userId);
      return { onlineUsers: next };
    });
  },

  setOnlineUsers: (userIds) => {
    set({ onlineUsers: new Set(userIds) });
  },

  updateConversationLastMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations
        .map((c) =>
          c._id === conversationId ? { ...c, lastMessage: message, updatedAt: message.createdAt } : c
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
    }));
  },

  updateMessageReactions: (messageId, reactions) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId].map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        );
      }
      return { messages: newMessages };
    });
  },

  upsertConversation: (conversation) => {
    set((state) => {
      const exists = state.conversations.find((c) => c._id === conversation._id);
      const updated = exists
        ? state.conversations.map((c) => (c._id === conversation._id ? conversation : c))
        : [conversation, ...state.conversations];
      return {
        conversations: updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
      };
    });
  },
}));
