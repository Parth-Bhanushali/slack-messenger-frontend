# Slack Messenger Frontend

A Slack-like chat app built with React, TypeScript, and Vite. It lets users select channels, view messages, and send messages. The UI is styled with TailwindCSS.

## Features

- Select channels from a dropdown.
- View messages for the selected channel.
- Send messages with a loading indicator.
- Supports newline with `Shift + Enter`.

## Technologies

- **React** (with TypeScript)
- **Vite** (development setup)
- **TailwindCSS** (styling)
- **Lucide-React** (icons)

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/parth-bhanushali/slack-channel-app.git
```

### 2. Install Dependencies

```bash
cd slack-messenger-frontend
yarn install
```

### 3. Run the Development Server

```bash
yarn dev
```

### 4. Run the Backend (IMPORTANT)

Ensure the backend is running on localhost:3001 (has been configured already) with the following endpoints:
 - ```GET /api/channels``` — Get channels
 - ```GET /api/messages/:channelId``` —  Get messages for a channel
 - ```POST /api/messages/:channelId``` — Send a message
