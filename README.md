# React + Vite
# Bondify

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Bondify is a full-stack social networking app where users can create accounts, share posts, follow people, and chat in real time.

Currently, two official plugins are available:
**Live demo:** [bondifyy.netlify.app](https://bondifyy.netlify.app)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
## Features

Live at bondifyy.netlify.app
- Authentication with protected routes and cookie-based sessions.
- Profile photo upload support.
- Create, view, like, comment on, and delete posts.
- Follow/unfollow users and view followers/following lists.
- User discovery with search.
- Real-time chat and unread message notifications with Socket.IO.
- Image sharing inside chat.

## Tech Stack

### Frontend
- React + Vite
- React Router
- Redux Toolkit
- Axios
- Socket.IO client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (via cookies)
- Multer for upload handling
- Cloudinary for media storage
- Socket.IO for real-time messaging

## Project Structure

```text
Bondify/
├── src/                 # Frontend (React + Vite)
├── public/              # Frontend static assets
├── backend/
│   ├── controllers/     # Request handlers
│   ├── Routes/          # Express route definitions
│   ├── models/          # Mongoose models
│   ├── middlware/       # Auth/upload middleware
│   └── server.js        # Express + Socket.IO server
├── package.json         # Frontend scripts/deps
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or Atlas)
- Cloudinary account

## Environment Variables

Create a `.env` file in `backend/` with:

```env
PORT=5000
MONGO_URL=<your_mongodb_connection_string>
SECRET_KEY=<your_jwt_secret>
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>
```

Create a `.env` file in the project root (frontend) with:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Installation

Install dependencies for both apps:

```bash
# frontend deps (project root)
npm install

# backend deps
cd backend
npm install
```

## Running Locally

Start backend:

```bash
cd backend
npm run dev
```

Start frontend (new terminal):

```bash
npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).

## Scripts

### Frontend (root)

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint

### Backend (`backend/`)

- `npm run dev` — start backend with nodemon
- `npm start` — start backend with node

## API Overview

Base URL (local): `http://localhost:5000`

### Auth (`/auth`)
- `POST /register`
- `POST /login`
- `POST /logout`
- `POST /isloggedin`
- `POST /api/user/profile`

### Users (`/user`)
- `GET /allusers`
- `GET /:id/info`
- `POST /views/:id`
- `GET /search`

### Posts (`/user/post`)
- `POST /create`
- `POST /delete/:id`
- `GET /allposts`
- `POST /likepost/:id`
- `POST /comment/:id`
- `GET /getcomments/:id`

### Connections (`/user/connections`)
- `POST /:id/follow`
- `POST /:id/unfollow`
- `GET /followers`
- `GET /following`

### Messages (`/messages`)
- `POST /send/:id`
- `GET /getmessages/:id`
- `POST /uploadchatimage`
- `POST /markasread`
- `GET /unread`
- `POST /deletemessages`

## Deployment Notes

- Frontend is configured to run on Netlify.
- Make sure CORS origins in `backend/server.js` include your deployed frontend URL.
- Ensure `VITE_BACKEND_URL` points to your deployed backend.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.