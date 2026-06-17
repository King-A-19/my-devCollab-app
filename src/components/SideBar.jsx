import React from "react";

const TAGS = ["Frontend", "Backend", "Bug", "Feature"];

export default function SideBar({
  projects,
  selectedProject,
  setSelectedProject,
  selectedTags,
  setSelectedTags,
}) {
  return (
    <aside className="sidebar">
      <h3>Projects</h3>

      <div className="projects">
        <button
          onClick={() => setSelectedProject("")}
          className={!selectedProject ? "active" : ""}
        >
          All Projects
        </button>

        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProject(proj.id)}
            className={selectedProject === proj.id ? "active" : ""}
          >
            {proj.name}
          </button>
        ))}
      </div>

      <h3>Filters</h3>

      <div className="filters">
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
    </aside>
  );
}
