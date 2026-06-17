import { useState, useEffect } from "react";
import "./App.css";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { db } from "./firebase/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [projectName, setProjectName] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      setProjects(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });
    return () => unsub();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !user) return;

    await addDoc(collection(db, "projects"), {
      name: projectName,
      createdBy: user.uid,
      createdAt: new Date(),
    });

    setProjectName("");
  };

  return (
    <div className="app">
      <NavBar />
      <div className="container">
        <SideBar
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        <Main
          projects={projects}
          selectedProject={selectedProject}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          setSelectedProject={setSelectedProject}
          projectName={projectName}
          setProjectName={setProjectName}
          handleCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
}

export default App;
