import { useState } from 'react';
import Icon from './Icons.jsx';
import { contactLinks, contactReady } from './contact.js';

export function StatusCapsule({ time, onContact }) {
  return <div className="status-wrap"><button className="status-capsule" popoverTarget="studio-status"><i aria-hidden="true"/>{time} IST<span>Studio notes</span><span aria-hidden="true">＋</span></button><div id="studio-status" popover="auto" className="app-popover status-popover"><span className="goal-label">STUDIO</span><h2>Tanxdai</h2><p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}</p><div className="status-row"><span>Studio time (India)</span><strong>{time}</strong></div><div className="status-row"><span>Project availability</span><strong>Let’s discuss</strong></div><button className="visit-website" onClick={() => { document.getElementById('studio-status').hidePopover(); onContact(); }}>Start a conversation <Icon name="arrowUpRight" /></button></div></div>;
}

// One contact action: a real link when configured in contact.js, otherwise a button that explains it is not set up yet.
function ContactOption({ href, notice, onMissing, icon, title, hint }) {
  const body = <><span className="contact-option-icon">{icon}</span><span><strong>{title}</strong><small>{hint}</small></span><Icon name="arrowUpRight" /></>;
  return href
    ? <a className="contact-option" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{body}</a>
    : <button type="button" className="contact-option" onClick={() => onMissing(notice)}>{body}</button>;
}
const icons = {
  whatsapp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 01-12.6 7.4L3 20l1.1-4.4A8.5 8.5 0 1120 11.5Z"/><path d="M8 7c0 5 4 9 9 9l1-3-3-1-1 1c-2-1-3-2-4-4l1-1-1-2Z"/></svg>,
  email: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>,
  booking: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-14 5h4"/></svg>,
};

// The three ways to get in touch, with the topic pre-filled. Used in the header panel and the call dialog.
export function ContactActions({ topic }) {
  const [notice, setNotice] = useState('');
  const links = contactLinks(topic);
  return <>
    <ContactOption href={links.booking} notice="Online booking is not set up yet." onMissing={setNotice} icon={icons.booking} title="Book a call" hint="Discuss scope and next steps" />
    <ContactOption href={links.whatsapp} notice="WhatsApp is not set up yet." onMissing={setNotice} icon={icons.whatsapp} title="WhatsApp" hint="Start a conversation" />
    <ContactOption href={links.email} notice="Email is not set up yet." onMissing={setNotice} icon={icons.email} title="Email" hint="Tell me about your project" />
    <p role="status" className="contact-note">{notice || (contactReady ? 'I usually reply within a working day.' : 'Preview · contact details coming soon')}</p>
  </>;
}

export function ContactDock({ onContact }) {
  const [open, setOpen] = useState(false);
  const close = () => document.getElementById('contact-actions').hidePopover();
  return <div className="contact-dock">
    <button id="contact-button" popoverTarget="contact-actions" aria-expanded={open} aria-controls="contact-actions">Let’s talk <span className="contact-plus" aria-hidden="true">{open ? '−' : '+'}</span></button>
    <div id="contact-actions" popover="auto" className="app-popover contact-popover expanding-contact" onToggle={event => setOpen(event.newState === 'open')}>
      <div className="contact-panel-heading"><div><span className="goal-label">CONTACT</span><h2>Let’s talk.</h2></div><button className="contact-panel-close" aria-label="Close contact options" onClick={close}><Icon name="close" /></button></div>
      <ContactActions />
    </div>
  </div>;
}
