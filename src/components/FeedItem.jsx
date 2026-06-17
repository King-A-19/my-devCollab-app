import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function FeedItem({
  user,
  userId,
  content,
  projectId,
  projectName,
  tags,
  time,
  onDelete,
  id,
  onLike,
  liked,
  likes,
}) {
  const { user: currentUser } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <motion.div
      className="feed-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="feed-header">
        <div className="left">
          <span className="avatar">{user?.[0]?.toUpperCase()}</span>
          <div className="meta">
            <p className="project">{projectName}</p>
            <div className="tag-list">
              {(tags || []).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <strong className="username">{user}</strong>
            <p className="time">
              {time?.toDate ? dayjs(time.toDate()).from(now) : "Just now"}
            </p>
          </div>
        </div>
        {currentUser?.uid === userId && (
          <button className="delete-btn" onClick={() => onDelete(id)}>
            ✕
          </button>
        )}
      </div>
      <p className="content">{content}</p>
      <div className="feed-actions">
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={() => onLike(id, liked, likes)}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </motion.button>
      </div>
    </motion.div>
  );
}
