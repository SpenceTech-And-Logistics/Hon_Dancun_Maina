import { Link } from "react-router-dom";
import "./ProjectCard.css";

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      {project.image?.[0]}
      <div className="project-info">
        <span className="status">{project.status}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <Link className="details-link" to={`/projects/${project.id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProjectCard;
