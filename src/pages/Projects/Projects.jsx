import { useState } from "react";
import projectsData from "../../data/projects";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

import "./Projects.css";

function Projects() {
  const [search, setSearch] = useState("");

  const filteredProjects = projectsData.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <h1>Development Projects</h1>

        <p>
          Explore completed and ongoing projects improving lives across
          communities.
        </p>
      </section>

      <section className="projects-container">
        <input
          type="text"
          placeholder="Search Projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Projects;
