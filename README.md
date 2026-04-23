# Syncly — Client

The frontend for Syncly. Built with **React + Vite + TypeScript**, styled with **Tailwind CSS v4**, state managed by **Zustand**, and real-time via **Socket.IO**.

---

## Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Framework  | React 18 + Vite             |
| Language   | TypeScript                  |
| Styling    | Tailwind CSS v4             |
| State      | Zustand + persist middleware|
| HTTP       | Axios (with interceptors)   |
| Realtime   | Socket.IO client            |
| Date utils | date-fns                    |
| Emoji      | emoji-picker-react          |

---

## Project Structure

```
client/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── syncly-icon.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPage.tsx          # Login / Register page wrapper
│   │   │   ├── LoginForm.tsx         # Login form + seed credentials
│   │   │   └── RegisterForm.tsx      # Register form
│   │   ├── chat/
│   │   │   ├── ChatHeader.tsx        # Conversation header + presence
│   │   │   ├── ChatWindow.tsx        # Main chat view
│   │   │   ├── MessageBubble.tsx     # Single message (reactions, reply, delete)
│   │   │   ├── MessageInput.tsx      # Textarea + emoji picker + reply preview
│   │   │   └── MessageList.tsx       # Scrollable message list + typing indicator
│   │   ├── layout/
│   │   │   └── ChatLayout.tsx        # Sidebar + chat panel layout
│   │   ├── sidebar/
│   │   │   ├── ConversationItem.tsx  # Single conversation row
│   │   │   ├── ConversationList.tsx  # Scrollable conversation list
│   │   │   ├── NewChatModal.tsx      # Search users + start DM or group
│   │   │   ├── ProfileModal.tsx      # Edit profile (username, status, avatar)
│   │   │   ├── SearchBar.tsx         # Conversation search/filter
│   │   │   └── Sidebar.tsx           # Sidebar shell + header
│   │   └── ui/
│   │       ├── Avatar.tsx            # User avatar with fallback initials
│   │       ├── SessionExpiredModal.tsx # Session expiry popup
│   │       └── Spinner.tsx           # Loading spinner
│   ├── hooks/
│   │   └── useSocket.ts              # Socket.IO event listeners
│   ├── lib/
│   │   ├── api.ts                    # Axios instance + refresh token interceptor
│   │   └── socket.ts                 # Socket.IO client singleton
│   ├── store/
│   │   ├── authStore.ts              # Auth state (user, tokens, session)
│   │   └── chatStore.ts              # Conversations, messages, presence
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                       # Root component + routing
│   ├── main.tsx                      # React entry point
│   └── index.css                     # Global styles + Tailwind
├── .env                              # Local env vars (gitignored)
├── .env.example                      # Template — copy to .env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment

```bash
cp client/.env.example client/.env
```

`client/.env` (Vite requires the `VITE_` prefix for browser-exposed vars):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Syncly
```

> The dev server proxies `/api` → `http://localhost:5000` via `vite.config.ts`, so `VITE_API_URL` is mainly used for production builds.

### 3. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

> Make sure the backend is running first — see `server/README.md`.

---

## Scripts

| Script            | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start Vite dev server (port 5173)    |
| `npm run build`   | Production build → `dist/`           |
| `npm run preview` | Preview production build locally     |

---

## Key Concepts

### Token Refresh
`src/lib/api.ts` has a response interceptor that:
1. Catches any `401` response
2. Silently calls `POST /api/auth/refresh` with the stored refresh token
3. Retries the original request with the new access token
4. If refresh also fails → fires a `session-expired` event → shows modal

### Socket Connection
`src/lib/socket.ts` exports a singleton Socket.IO client.  
`src/hooks/useSocket.ts` registers all event listeners (messages, typing, presence, etc.) and cleans them up on unmount.

### State Management
- **authStore** — user, access token, refresh token, session expired flag. Persisted to `localStorage` via Zustand `persist`.
- **chatStore** — conversations, messages per conversation, online users, typing users. In-memory only (refetched on load).

---

## Test Accounts

The login page shows clickable seed credentials. Click any name to auto-fill the form:

| Name    | Email               | Password    |
|---------|---------------------|-------------|
| Alice   | alice@syncly.dev    | password123 |
| Bob     | bob@syncly.dev      | password123 |
| Charlie | charlie@syncly.dev  | password123 |

Open two browser tabs with different accounts to test real-time chat.

---

## Environment Variables

| Variable          | Description                        | Example                        |
|-------------------|------------------------------------|--------------------------------|
| `VITE_API_URL`    | Backend REST API base URL          | `http://localhost:5000/api`    |
| `VITE_SOCKET_URL` | Backend Socket.IO URL              | `http://localhost:5000`        |
| `VITE_APP_NAME`   | App display name                   | `Syncly`                       |
