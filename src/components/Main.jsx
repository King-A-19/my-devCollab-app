import React, { useEffect, useState } from "react";
import FeedItem from "./FeedItem";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

const TAGS = ["Frontend", "Backend", "Bug", "Feature"];

export default function Main({
  projects,
  selectedProject,
  selectedTags,
  projectName,
  setProjectName,
  handleCreateProject,
  setSelectedProject,
  setSelectedTags,
}) {
  const [text, setText] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpdates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const filteredUpdates = updates.filter((item) => {
    const projectMatch = !selectedProject || item.projectId === selectedProject;
    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => item.tags?.includes(tag));
    return projectMatch && tagMatch;
  });

  const handlePost = async () => {
    if (!text.trim() || !user || !selectedProject) return;
    setLoading(true);
    const selectedProj = projects.find((p) => p.id === selectedProject);
    await addDoc(collection(db, "updates"), {
      user: user.displayName,
      userId: user.uid,
      content: text,
      projectId: selectedProject,
      projectName: selectedProj?.name || "",
      tags: selectedTags,
      createdAt: serverTimestamp(),
      likes: 0,
      liked: false,
    });
    setText("");
    setSelectedTags([]);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "updates", id));
  };

  const handleLike = async (id, liked, likes) => {
    const ref = doc(db, "updates", id);

    const isLiked = !liked;

    await updateDoc(ref, {
      liked: isLiked,
      likes: isLiked ? likes + 1 : likes - 1,
    });
  };

  {
    filteredUpdates.length === 0 && (
      <p className="empty">No updates yet. Be the first </p>
    );
  }

  return (
    <main className="main">
      <div className="project-controls">
        <div className="project-create">
          <input
            placeholder="New project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <button onClick={handleCreateProject}>Create Project</button>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>

        <div className="tags">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag],
                )
              }
              className={selectedTags.includes(tag) ? "active" : ""}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="create-box">
        <textarea
          placeholder="What did you work on today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          disabled={loading || !text.trim()}
          onClick={handlePost}
          disabled={!text.trim()}
        >
          {loading ? "Posting..." : "Post Update"}
        </button>
      </div>

      <div className="feed">
        {filteredUpdates.map((item) => (
          <FeedItem
            key={item.id}
            {...item}
            time={item.createdAt}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))}
      </div>
    </main>
  );
}
