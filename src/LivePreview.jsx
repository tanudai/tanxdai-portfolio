import Icon from './Icons.jsx';

// Monogram for projects without a screenshot yet, e.g. 'Bowood by Niche' -> 'BN'.
export const initials = name => name.split(/\s+/).filter(w => /^[A-Z0-9]/.test(w)).slice(0, 2).map(w => w[0]).join('');

import { motion } from 'motion/react';

export default function LivePreview({ project, imgY }) {
  return <div className="preview-area">
    <a className="live-preview" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
      aria-label={`Visit ${project.name} website in a new tab`} onPointerDown={event => event.stopPropagation()}>
      <div className="window-head"><span aria-hidden="true">● ● ●</span><span>{new URL(project.liveUrl).hostname}</span><Icon name="arrowUpRight" /></div>
      <div className="preview-surface">
        {project.image
          ? <picture><source media="(max-width: 600px)" srcSet={project.mobileImage} /><motion.img src={project.image} alt={`${project.name} homepage`} draggable={false} decoding="async" style={{ y: imgY }} /></picture>
          : <div className="preview-pending"><b aria-hidden="true">{initials(project.name)}</b><span>{new URL(project.liveUrl).hostname}</span><small>Preview image coming soon · open the live site <Icon name="arrowUpRight" /></small></div>}
      </div>
    </a>
  </div>;
}
