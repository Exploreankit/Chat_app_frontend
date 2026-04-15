export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  status: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  type: "text" | "image" | "file" | "system";
  fileUrl?: string;
  fileName?: string;
  readBy: { user: string; readAt: string }[];
  replyTo?: Message;
  isDeleted: boolean;
  reactions: { user: User | string; emoji: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupAdmin?: string;
  lastMessage?: Message;
  unreadCount?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TypingUser {
  userId: string;
  username: string;
  conversationId: string;
}
