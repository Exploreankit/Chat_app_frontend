import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track whether a refresh is already in-flight to avoid parallel refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token as string);
  });
  failedQueue = [];
};

// Response interceptor: silently refresh on 401, show modal if refresh also fails
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config as typeof err.config & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401s that haven't been retried yet,
    // and skip the refresh endpoint itself to avoid infinite loops
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token — session is fully expired
        window.dispatchEvent(new CustomEvent("session-expired"));
        return Promise.reject(err);
      }

      if (isRefreshing) {
        // Queue this request until the ongoing refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL ?? "/api"}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Update the default header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        processQueue(null, data.token);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Refresh token is also expired — session fully expired
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new CustomEvent("session-expired"));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
