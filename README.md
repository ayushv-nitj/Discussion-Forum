
# 💬 Real-Time Discussion Forum

A real-time chat-based discussion forum where users can create threads based on projects or topics, collaborate live with messages, and manage conversations with editing, deleting, emoji support, and more. 🚀

![Banner](public/banner.png) <!-- Replace with your own banner image -->

---

## 📸 Demo Preview

| Dashboard Threads Page | Real-Time Chat Page |
|------------------------|---------------------|
| ![Threads](public/thread.png) | ![Chat](public/chat.png) | <!-- Replace with your actual images -->

---

## 🌐 Live Site

👉 [https://discussion-forum.vercel.app](https://discussion-forum.vercel.app)

---

## 🛠 Tech Stack

### **Frontend:**
- [Next.js](https://nextjs.org/)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [NextAuth.js](https://next-auth.js.org/) (Google Login)
- [Moment.js](https://momentjs.com/) (Timestamps)
- [Emoji Picker React](https://github.com/ealush/emoji-picker-react)

### **Backend:**
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/) (Real-time communication)
- [dotenv](https://github.com/motdotla/dotenv)

### **Deployment:**
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)

---

## ✅ Features

- 🔐 Google Login Authentication (NextAuth)
- 🧵 Create & delete project-specific threads
- 💬 Real-time messaging with Socket.IO
- ✏️ Edit/Delete your own messages
- 😄 Emoji picker integration
- 🌙 Toggle between Dark & Light Mode
- 🕒 User-friendly timestamps (e.g. "5 minutes ago")
- 🧠 Clean and responsive UI
- 🔎 Thread search functionality
- 📁 Thread categorization (coming soon...)

---

## 📁 Folder Structure

```
├── backend
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── .env
└── frontend (Next.js)
    ├── pages/
    ├── public/
    ├── styles/
    ├── components/
    └── next.config.js
```

---

## 🚀 Getting Started (Local Setup)

### 🔧 Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=3001
MONGO_URI=your_mongodb_connection_uri
```

Run the server:

```bash
node server.js
```

---

### 💻 Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the frontend:

```bash
npm run dev
```

---

## 🌍 Deployment Links

- **Frontend (Vercel)**: [discussion-forum.vercel.app](https://discussion-forum.vercel.app)
- **Backend (Render)**: Deployed from `server.js`, auto-starts with MongoDB.

---

## 🤯 Issues Faced & Learnings

- CORS issues during backend/frontend separation
- Proper deployment of `.env` variables on Render & Vercel
- Handling real-time Socket.IO in Next.js
- Mongoose schema design for scalable threading
- Conditional rendering, UI/UX polishing

---

## 👨‍💻 Author

**Ayush Verma**  
🔗 [LinkedIn](https://www.linkedin.com/in/ayush-verma-jsr25/)  
🔗 [GitHub](https://github.com/ayushv-nitj)  
📸 [Instagram](https://www.instagram.com/av_alanche._/)

---

## 🙌 Contributions

Suggestions, feedback, and contributions are welcome! Feel free to open issues or pull requests.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).