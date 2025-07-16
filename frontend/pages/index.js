import Image from "next/image";
import styles from '@/styles/Home.module.css';
import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaSearch } from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [newDescription, setNewDescription] = useState("");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  const projectId = "project1";
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session) {
      axios.get(`${baseURL}/api/threads/${projectId}`)
        .then(res => setThreads(res.data))
        .catch(err => console.error("Error fetching threads:", err));
    }
  }, [session]);

  const createThread = async () => {
    if (!newThreadTitle.trim()) return;

    try {
      const res = await axios.post(`${baseURL}/api/threads`, {
        title: newThreadTitle,
        projectId,
        user: session.user,
        description: newDescription,
      });

      setThreads(prev => [...prev, res.data]);
      setNewThreadTitle("");
      setNewDescription("");
    } catch (err) {
      console.error("Thread creation failed:", err);
      alert("Could not create thread. Please try again.");
    }
  };

  const promptDelete = (id) => {
    setSelectedThreadId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/api/threads/${selectedThreadId}`, {
        data: { email: session.user.email }
      });
      setThreads(prev => prev.filter(thread => thread._id !== selectedThreadId));
    } catch (err) {
      console.error("Delete thread failed:", err);
      alert("You are not authorized to delete this thread.");
    }

    setShowConfirm(false);
    setSelectedThreadId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedThreadId(null);
  };

  if (!session) {
    return (
      <div className={styles.loginContainer}>
        <button onClick={() => signIn()} className={styles.loginButton}>
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.mainContainer} ${darkMode ? styles.dark : ""}`}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Discussion Forum 🚀</h1>
        <div className={styles.headerButtons}>
          <button onClick={() => setDarkMode(!darkMode)} className={styles.darkModeToggle}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <a href="/about.html" target="_blank" rel="noopener noreferrer">
            <button className={styles.aboutButton}>About Us</button>
          </a>
          <button onClick={() => signOut()} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Welcome User */}
      <div className={styles.userInfo}>
        <Image
          src={session.user.image}
          alt="User profile picture"
          width={40}
          height={40}
          className={styles.userImage}
        />
        <div>
          <p className={styles.welcomeText}>Welcome, {session.user.name}</p>
          <p className={styles.subText}>Start or join a project discussion below.</p>
        </div>
      </div>

      {/* Create Thread */}
      <div className={styles.newThreadContainer}>
        <h3 className={styles.newThreadTitle}>Start a New Discussion</h3>
        <div className={styles.threadInputWrapper}>
          <input
            placeholder="New thread title"
            className={styles.threadInput}
            value={newThreadTitle}
            onChange={e => setNewThreadTitle(e.target.value)}
          />
          <input
            placeholder="Optional thread description"
            className={styles.threadDescriptionInput}
            value={newDescription}
            onChange={e => setNewDescription(e.target.value)}
          />
          <button onClick={createThread} className={styles.createButton}>
            Create
          </button>
        </div>
      </div>



<div className={styles.searchContainer}>
  <FaSearch style={{ position: "absolute", marginLeft: "15px", marginTop: "12px", color: "#aaa" }} />
  <input
    type="text"
    placeholder="Search threads by title..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className={styles.searchInput}
    style={{ paddingLeft: "2.5rem" }} // icon spacing
  />
</div>


      {/* Thread List */}
      <h2 className={styles.threadTitle}>Discussion Threads</h2>
      <div className={styles.threadGrid}>
        {threads
  .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
  .map(t => (

          <div key={t._id} className={styles.threadCard}>
            <h4 className={styles.threadHeading}>
              <Link href={`/thread/${t._id}`} className={styles.threadLink}>
                {t.title}
              </Link>
            </h4>
            {t.description ? (
              <p className={styles.threadDescription}>{t.description}</p>
            ) : (
              <p className={styles.threadDescription} style={{ opacity: 0.5 }}>
                No description provided.
              </p>
            )}
            <p className={styles.threadAuthor}>
              Created by: <span className={styles.threadName}>{t.createdBy.name}</span>
              <span className={styles.threadTime}>
                • {moment(t.createdAt).fromNow()} ({moment(t.createdAt).format('LL')})
              </span>
            </p>
            {t.createdBy.email === session.user.email && (
              <button
                onClick={() => promptDelete(t._id)}
                className={styles.deleteButton}
              >
                🗑 Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        Made with <span className={styles.heart}>♥</span> by AV |
        <a href="https://github.com/ayushv-nitj" target="_blank" rel="noopener noreferrer"> GitHub </a> |
        <a href="https://www.linkedin.com/in/ayush-verma-jsr25/" target="_blank" rel="noopener noreferrer"> LinkedIn </a> |
        <a href="https://www.instagram.com/av_alanche._/" target="_blank" rel="noopener noreferrer"> Instagram </a>
      </footer>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this thread?</p>
            <div className={styles.modalButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}>Yes, Delete</button>
              <button onClick={cancelDelete} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
