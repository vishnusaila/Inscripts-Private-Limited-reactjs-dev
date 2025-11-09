# Inscripts-Private-Limited-reactjs-dev


# Trello Real-time WebSockets + API Frontend Assignment

## Overview
This project is a **Trello-like web application** built with React for the frontend and Node.js/Express for the backend. It integrates with Trello’s REST API and uses **WebSockets (Socket.IO)** to provide **real-time synchronization** for boards, lists, and cards.

---

## Features
- Trello-style boards, lists, and cards.
- Real-time updates across multiple clients.
- Full CRUD functionality for Trello cards:
  - Create card
  - Update card
  - Delete/close card
- Create new boards.
- Backend handles Trello webhooks to broadcast real-time events.
- Optimistic UI updates for smoother experience.

---

## Tech Stack
- **Frontend:** React, Axios, Socket.IO-client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** Trello API (no local DB)
- **Deployment:** Render (backend), Netlify (frontend)

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- NPM/Yarn
- Trello API Key & Token
- Ngrok (for local webhook testing) or a publicly accessible backend

### Installation

#### Backend
1. Navigate to backend folder:
```bash
cd backend
Install dependencies:

npm install


Create .env file and add your Trello credentials:

TRELLO_API_KEY=your_api_key
TRELLO_TOKEN=your_api_token
PORT=5000


Start the backend:

npm run dev


Optionally, run ngrok for a public URL:

ngrok http 5000

Frontend

Navigate to frontend folder:

cd frontend


Install dependencies:

npm install


Create .env file:

REACT_APP_BACKEND_URL=http://localhost:5000


Start the frontend:

npm start

Trello Webhook Registration

After starting your backend and obtaining a public URL (e.g., via ngrok), register a Trello webhook pointing to your backend endpoint:

curl -X POST "https://api.trello.com/1/webhooks/?key=<YOUR_KEY>&token=<YOUR_TOKEN>" \
-d "description=My Trello Webhook" \
-d "callbackURL=<YOUR_PUBLIC_BACKEND_URL>/webhook" \
-d "idModel=<BOARD_ID>"

API Endpoints

Create card
POST /api/tasks

{ "boardId": "<board_id>", "listId": "<list_id>", "name": "Card Title", "desc": "Details" }


Update card
PUT /api/tasks/:cardId

{ "name": "New Title", "desc": "Updated description", "idList": "<list_id>" }


Delete/close card
DELETE /api/tasks/:cardId

Create board
POST /api/boards

{ "name": "New Board", "defaultLists": true }

Deployment

Backend: https://inscripts-private-limited-reactjs-dev.onrender.com

Frontend: Deployed on Netlify (URL in frontend README or .env)

Demo

A short video demo showing real-time sync across two browser windows is included in the repo.
