export default function LivePreview({ project }) {
  return <div className="preview-area">
    <a className="live-preview" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`Visit ${project.name} website in a new tab`} onPointerDown={event => event.stopPropagation()}>
      <div className="window-head"><span aria-hidden="true">● ● ●</span><span>{new URL(project.liveUrl).hostname}</span><span aria-hidden="true">↗</span></div>
      <div className="preview-surface">
        <picture><source media="(max-width: 600px)" srcSet={project.mobileImage} /><img src={project.image} alt={`${project.name} homepage`} draggable={false} decoding="async" /></picture>
      </div>
    </a>
  </div>;
}
