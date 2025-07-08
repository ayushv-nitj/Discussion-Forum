import styles from '@/styles/Thread.module.css';

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:3001");

export default function ThreadPage() {
  const router = useRouter();
  const { threadId } = router.query;
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
 // <-- Dark mode state


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [threadTitle, setThreadTitle] = useState("");

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    const res = await axios.put(`http://localhost:3001/api/messages/${id}`, {
      content: editText,
    });
    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, content: res.data.content } : msg))
    );
    cancelEdit();
  };

  const deleteMessage = async (id) => {
    await axios.delete(`http://localhost:3001/api/messages/${id}`);
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  };

  useEffect(() => {
    if (threadId) {
      axios.get(`http://localhost:3001/api/messages/${threadId}`).then((res) => setMessages(res.data));
      axios.get(`http://localhost:3001/api/threads/${threadId}`).then((res) => setThreadTitle(res.data.title));
    }
  }, [threadId]);

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      if (msg.threadId === threadId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, [threadId]);

  const sendMessage = async () => {
    const msg = {
      threadId,
      user: {
        id: session.user.id,
        name: session.user.name,
        image: session.user.image,
      },
      content: input,
    };
    await axios.post("http://localhost:3001/api/messages", msg);
    socket.emit("send-message", msg);
    setInput("");
  };

  if (!session) return <p className={styles.loadingText}>Loading...</p>;

  return (
 <div className={`${styles.threadContainer} ${darkMode ? styles.dark : ''}`}>      {/* Navbar */}
 <button
  onClick={() => setDarkMode(!darkMode)}
  className={styles.backButton}
>
  {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
</button>

      <div className={styles.navbar}>
        <h2 className={styles.threadHeading}> Thread: {threadTitle}</h2>
        <button
          onClick={() => router.push("/")}
          className={styles.backButton}>
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.user.id === session.user.id ? styles.ownMessage : styles.otherMessage}`}
          >
            <div className={styles.messageHeader}>
              <img src={msg.user.image} className={styles.userAvatar} />
              <span className={styles.userName}>{msg.user.name}</span>
              <span className={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>

            {editingId === msg._id ? (
              <div className={styles.editingWrapper}>
                <input
                  className={styles.editInput}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className={styles.saveBtn} onClick={() => saveEdit(msg._id)}>✔</button>
                <button className={styles.cancelBtn} onClick={cancelEdit}>✖</button>
              </div>
            ) : (
              <p>{msg.content}</p>
            )}

            {msg.user.id === session.user.id && editingId !== msg._id && (
              <div className={styles.actionButtons}>
                <button onClick={() => startEdit(msg)}>✏️ Edit</button>
                <button onClick={() => deleteMessage(msg._id)}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className={styles.inputContainer}>
        <button className={styles.emojiBtn} onClick={() => setShowPicker(!showPicker)}>
          😊
        </button>

        {showPicker && (
          <div className={styles.emojiPickerWrapper}>
            <EmojiPicker
              onEmojiClick={(e) => {
                setInput((prev) => prev + e.emoji);
                setShowPicker(false);
              }}
              height={350}
              width={300}
              lazyLoadEmojis={true}
            />
          </div>
        )}

        <input
          className={styles.messageInput}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className={styles.sendButton}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        Made with <span className={styles.heart}>♥</span> by AV |
        <a href="https://github.com/ayushv-nitj" target="_blank" rel="noopener noreferrer"> GitHub </a>|
        <a href="https://www.linkedin.com/in/ayush-verma-jsr25/" target="_blank" rel="noopener noreferrer"> LinkedIn </a>|
        <a href="https://www.instagram.com/av_alanche._/" target="_blank" rel="noopener noreferrer"> Instagram </a>
      </footer>
    </div>
  );
}
