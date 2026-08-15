import type { Project } from "@/lib/portfolio";
import { projectTone } from "@/lib/portfolio";

function projectInitials(title: string) {
  return title.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

export function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className={`project-visual tone-${projectTone(project)}`} data-title={project.title}>
      {project.coverImage ? (
        <img src={project.coverImage} alt={`Capa do projeto ${project.title}`} loading={priority ? "eager" : "lazy"} />
      ) : (
        <>
          <div className="visual-grid" />
          <div className="visual-window">
            <div className="visual-window-bar"><i /><i /><i /><span>{project.slug}.dev</span></div>
            <code><b>01</b> project: <em>&quot;{project.title}&quot;</em></code>
            <code><b>02</b> type: <em>&quot;{project.category}&quot;</em></code>
            <code><b>03</b> stack: [{project.technologies.slice(0, 2).map((tech) => `&quot;${tech}&quot;`).join(", ")}]</code>
            <div className="visual-bars"><i /><i /><i /></div>
          </div>
          <span className="visual-index">{String(project.id).padStart(2, "0")}</span>
          <strong>{projectInitials(project.title)}</strong>
          <div className="visual-techs">{project.technologies.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div>
        </>
      )}
      <span className="visual-source">{project.showProjectLink && project.projectUrl ? "PROJETO / ONLINE" : project.githubUrl ? "GITHUB / PÚBLICO" : "CASE / PRIVADO"}</span>
    </div>
  );
}
