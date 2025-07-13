import styles from '@/styles/Thread.module.css';
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL); // ✅ dynamic socket base URL

export default function ThreadPage() {
  const router = useRouter();
  const { threadId } = router.query;
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const startEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${baseURL}/api/messages/${id}`, {
        content: editText,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id ? { ...msg, content: res.data.content } : msg
        )
      );
      cancelEdit();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    if (threadId && session?.user?.id) {
      axios.get(`${baseURL}/api/messages/${threadId}`).then((res) => setMessages(res.data));
      axios.get(`${baseURL}/api/threads/${threadId}`).then((res) => setThreadTitle(res.data.title));

      // ✅ Mark as read
      axios.post(`${baseURL}/api/messages/mark-read`, {
        threadId,
        userId: session.user.id
      }).catch(err => console.error("Failed to mark messages as read:", err));
    }
  }, [threadId, session]);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.threadId === threadId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive); // ✅ Prevent multiple listeners
    };
  }, [threadId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = {
      threadId,
      user: {
        id: session?.user?.id,
        name: session?.user?.name,
        image: session?.user?.image,
      },
      content: input,
    };

    try {
      await axios.post(`${baseURL}/api/messages`, msg);
      socket.emit("send-message", msg);
      setInput("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  if (!session) return <p className={styles.loadingText}>Loading...</p>;

  return (
    <div className={`${styles.threadContainer} ${darkMode ? styles.dark : ''}`}>
      <button onClick={() => setDarkMode(!darkMode)} className={styles.backButton}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className={styles.navbar}>
        <h2 className={styles.threadHeading}>Thread: {threadTitle}</h2>
        <button onClick={() => router.push("/")} className={styles.backButton}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div className={styles.chatWindow}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.user.id === session?.user?.id ? styles.ownMessage : styles.otherMessage
            }`}
          >
            <div className={styles.messageHeader}>
              <img src={msg.user.image} className={styles.userAvatar} alt="avatar" />
              <span className={styles.userName}>{msg.user.name}</span>
              <span className={styles.timestamp}>
                {msg.timestamp
                  ? new Date(msg.timestamp).toLocaleString()
                  : "Just now"}
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

            {msg.user.id === session?.user?.id && editingId !== msg._id && (
              <div className={styles.actionButtons}>
                <button onClick={() => startEdit(msg)}>✏️ Edit</button>
                <button onClick={() => deleteMessage(msg._id)}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

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
              lazyLoadEmojis
            />
          </div>
        )}

        <input
          className={styles.messageInput}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>

      <footer className={styles.footer}>
        Made with <span className={styles.heart}>♥</span> by AV |
        <a href="https://github.com/ayushv-nitj" target="_blank" rel="noopener noreferrer"> GitHub </a> |
        <a href="https://www.linkedin.com/in/ayush-verma-jsr25/" target="_blank" rel="noopener noreferrer"> LinkedIn </a> |
        <a href="https://www.instagram.com/av_alanche._/" target="_blank" rel="noopener noreferrer"> Instagram </a>
      </footer>
    </div>
  );
}
