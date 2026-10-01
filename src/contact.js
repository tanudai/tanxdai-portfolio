// Contact details. Fill these in to switch the contact actions on across the site (header "Let's talk", the call dialog, service cards).
// Until a value is set, its action shows an honest "coming soon" note instead of a dead link.
export const contact = {
  whatsapp: null, // international number, digits only, e.g. '919876543210'
  email: null,    // e.g. 'hello@yourdomain.com'
  booking: null,  // a scheduling link, e.g. 'https://cal.com/your-name/intro'
};

const greeting = topic => `Hi Tanxdai, I'd like to talk about ${topic ? topic.toLowerCase() : 'a project'}.`;

// Links with the visitor's topic pre-filled (e.g. the service they were reading about). Null when not configured.
export const contactLinks = topic => ({
  whatsapp: contact.whatsapp && `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(greeting(topic))}`,
  email: contact.email && `mailto:${contact.email}?subject=${encodeURIComponent(topic ? `Project enquiry: ${topic}` : 'Project enquiry')}&body=${encodeURIComponent(`${greeting(topic)}\n\n`)}`,
  booking: contact.booking,
});
export const contactReady = Boolean(contact.whatsapp || contact.email || contact.booking);
