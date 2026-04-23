import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";
import { connectSocket, disconnectSocket } from "../lib/socket";
import type { User } from "../types";

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchMe: () => Promise<void>;
  setSessionExpired: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      sessionExpired: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          connectSocket(data.token);
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            sessionExpired: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", {
            username,
            email,
            password,
          });
          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          connectSocket(data.token);
          set({
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            sessionExpired: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        // Best-effort server-side logout (fire and forget)
        api.post("/auth/logout").catch(() => {});
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        disconnectSocket();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          sessionExpired: false,
        });
      },

      updateProfile: async (data) => {
        const { data: res } = await api.put("/auth/profile", data);
        set({ user: res.user });
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.user, isAuthenticated: true });
        } catch {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        }
      },

      setSessionExpired: (value) => {
        set({ sessionExpired: value });
        if (value) {
          // Clear tokens but keep sessionExpired flag so the modal shows
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          disconnectSocket();
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
