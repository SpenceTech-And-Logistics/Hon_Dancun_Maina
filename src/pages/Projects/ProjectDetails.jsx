import { useParams } from "react-router-dom";
import projects from "../../data/projects";

function ProjectDetails() {
  const { id } = useParams();

  const project = projects.find((item) => item.id === Number(id));

  if (!project) {
    return <h2>Project Not Found</h2>;
  }

  return (
    <div className="container">
      <h1>{project.title}</h1>

      <p>{project.description}</p>

      <h3>Location</h3>
      <p>{project.location}</p>

      <h3>Status</h3>
      <p>{project.status}</p>

      <h3>Budget</h3>
      <p>{project.budget}</p>

      <h3>Beneficiaries</h3>
      <p>{project.beneficiaries}</p>

      <video width="100%" controls>
        {project.video}
      </video>
    </div>
  );
}

export default ProjectDetails;
