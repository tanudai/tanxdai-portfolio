import { useState } from 'react';
import Icon from './Icons.jsx';

export function StatusCapsule({ time, onContact }) {
  return <div className="status-wrap"><button className="status-capsule" popoverTarget="studio-status"><i aria-hidden="true"/>{time} IST<span>Studio notes</span><span aria-hidden="true">＋</span></button><div id="studio-status" popover="auto" className="app-popover status-popover"><span className="goal-label">STUDIO</span><h2>Tanxdai</h2><p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}</p><div className="status-row"><span>Studio time (India)</span><strong>{time}</strong></div><div className="status-row"><span>Project availability</span><strong>Let’s discuss</strong></div><button className="visit-website" onClick={() => { document.getElementById('studio-status').hidePopover(); onContact(); }}>Start a conversation <Icon name="arrowUpRight" /></button></div></div>;
}

export function ContactDock({ onContact }) {
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);
  const close = () => document.getElementById('contact-actions').hidePopover();
  return <div className="contact-dock">
    <button id="contact-button" popoverTarget="contact-actions" aria-expanded={open} aria-controls="contact-actions">Let’s talk <span className="contact-plus" aria-hidden="true">{open ? '−' : '+'}</span></button>
    <div id="contact-actions" popover="auto" className="app-popover contact-popover expanding-contact" onToggle={event => { setOpen(event.newState === 'open'); if (event.newState === 'closed') setNotice(''); }}>
      <div className="contact-panel-heading"><div><span className="goal-label">CONTACT</span><h2>Let’s talk.</h2></div><button className="contact-panel-close" aria-label="Close contact options" onClick={close}><Icon name="close" /></button></div>
      <button className="contact-option" onClick={() => setNotice('WhatsApp will be available once your number is added.')}><span className="contact-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 01-12.6 7.4L3 20l1.1-4.4A8.5 8.5 0 1120 11.5Z"/><path d="M8 7c0 5 4 9 9 9l1-3-3-1-1 1c-2-1-3-2-4-4l1-1-1-2Z"/></svg></span><span><strong>WhatsApp</strong><small>Start a conversation</small></span><span className="contact-option-arrow"><Icon name="arrowUpRight" /></span></button>
      <button className="contact-option" onClick={() => setNotice('Email will be available once your address is added.')}><span className="contact-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span><span><strong>Email</strong><small>Tell me about your project</small></span><span className="contact-option-arrow"><Icon name="arrowUpRight" /></span></button>
      <button className="contact-option" onClick={() => { close(); onContact(); }}><span className="contact-option-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-14 5h4"/></svg></span><span><strong>Book a call</strong><small>Discuss scope and next steps</small></span><span className="contact-option-arrow"><Icon name="arrowUpRight" /></span></button>
      <p role="status">{notice || 'Preview · contact details coming soon'}</p>
    </div>
  </div>;
}
