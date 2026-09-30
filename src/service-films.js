// Scripts for the 18 service films. Draft for the owner's review: edit the words here, the films follow.
// Every film: hook, need, what you get, best for, end card. No statistics or named companies.
// AI services (01–08) show their example walkthrough from walkthroughs.js; the others show a `demo` visual.
import { walkthroughs } from './walkthroughs.js';

const film = (id, category, name, script) => ({ id, category, name, ...script, walkthrough: walkthroughs[id] || null });

export const films = Object.fromEntries([
  film('01', 'AI & automation', 'Enquiry assistants', {
    hook: 'Every enquiry answered, even at midnight.',
    need: ['Enquiries wait until morning', 'The same questions, every day', 'Serious buyers go cold'],
    industries: [['factory', 'Manufacturing', 'Trade buyers ask detailed questions'], ['hotel', 'Hospitality', 'Guests enquire around the clock'], ['home', 'Real estate', 'Leads need quick qualification']],
    cta: 'Let’s scope your assistant',
  }),
  film('02', 'AI & automation', 'Quote preparation', {
    hook: 'Turn loose briefs into ready quotes.',
    need: ['Briefs arrive messy and incomplete', 'Quotes take days to prepare', 'Details get lost in email'],
    industries: [['factory', 'Manufacturing', 'Specs, quantities and lead times'], ['box', 'Printing & packaging', 'Every order is custom'], ['building', 'Building supplies', 'Long, detailed material lists']],
    cta: 'Let’s speed up your quotes',
  }),
  film('03', 'AI & automation', 'Knowledge assistants', {
    hook: 'Your team’s answers, one question away.',
    need: ['Policies hide in scattered files', 'New staff ask the same things', 'Answers differ between people'],
    industries: [['briefcase', 'Professional services', 'Procedures that change often'], ['clinic', 'Healthcare clinics', 'Staff need approved answers'], ['school', 'Education', 'Policies for staff and parents']],
    cta: 'Let’s organise your knowledge',
  }),
  film('04', 'AI & automation', 'Document workflows', {
    hook: 'Stop retyping invoices by hand.',
    need: ['Hours lost copying numbers', 'Typos slip into your records', 'PDFs pile up unread'],
    industries: [['chart', 'Accounting', 'Invoices and statements daily'], ['truck', 'Logistics', 'Delivery notes and customs forms'], ['box', 'Wholesale', 'Supplier invoices in volume']],
    cta: 'Let’s clear your paperwork',
  }),
  film('05', 'AI & automation', 'Support copilots', {
    hook: 'Faster, consistent replies that still sound human.',
    need: ['Agents hunt for the right policy', 'Replies vary between people', 'Urgent tickets get buried'],
    industries: [['cart', 'E-commerce', 'Orders, returns and replacements'], ['window', 'Software products', 'Detailed product questions'], ['plane', 'Travel', 'Changes and cancellations']],
    cta: 'Let’s support your support team',
  }),
  film('06', 'AI & automation', 'CRM & follow-ups', {
    hook: 'Never lose track of a warm lead.',
    need: ['Enquiries sit in inboxes', 'Follow-ups depend on memory', 'Nobody knows who owns it'],
    industries: [['briefcase', 'B2B sales', 'Long, multi-step deals'], ['home', 'Real estate', 'Many enquiries, quick follow-up'], ['pen', 'Agencies', 'Proposals need timely nudges']],
    cta: 'Let’s keep your pipeline moving',
  }),
  film('07', 'AI & automation', 'Product discovery', {
    hook: 'Help buyers find the right product fast.',
    need: ['Big catalogues overwhelm buyers', 'Specs are hard to compare', 'Buyers leave instead of asking'],
    industries: [['factory', 'Manufacturing', 'Many models and specifications'], ['cart', 'E-commerce', 'Large catalogues, careful buyers'], ['sofa', 'Home & interiors', 'Size and style both matter']],
    cta: 'Let’s guide your buyers',
  }),
  film('08', 'AI & automation', 'Content & reporting', {
    hook: 'Monthly reports, drafted before you ask.',
    need: ['Reports eat whole afternoons', 'Numbers copied from many files', 'Every draft starts blank'],
    industries: [['pen', 'Agencies', 'Client reports every month'], ['chart', 'Finance teams', 'Summaries from many sources'], ['heart', 'Non-profits', 'Updates for donors and boards']],
    cta: 'Let’s automate your reporting',
  }),
  film('09', 'Websites', 'Custom websites', {
    hook: 'A website built around your customers.',
    need: ['Templates look like everyone else', 'Visitors can’t find what matters', 'Enquiries never come through'],
    demo: 'browser', gets: ['Custom design and build', 'Mobile and desktop layouts', 'Launch checks and handover'],
    industries: [['factory', 'Manufacturers', 'Win trade buyers online'], ['briefcase', 'Professional services', 'Earn trust before the first call'], ['rocket', 'Startups', 'Launch with a clear story']],
    cta: 'Let’s plan your website',
  }),
  film('10', 'Websites', 'WordPress development', {
    hook: 'A website your team can actually update.',
    need: ['Every edit needs a developer', 'Plugins keep breaking things', 'The editor feels confusing'],
    demo: 'blocks', gets: ['Custom theme and blocks', 'Only the plugins you need', 'Editor training and handover'],
    industries: [['plane', 'Travel & tourism', 'Tours and offers change often'], ['school', 'Education', 'Regular news and events'], ['cart', 'Retail', 'Products and content together']],
    cta: 'Let’s build your WordPress site',
  }),
  film('11', 'Websites', 'AI feature integration', {
    hook: 'Give your product one genuinely useful AI skill.',
    need: ['AI feels big and vague', 'Worries about cost and data', 'Unsure where it fits'],
    demo: 'plugin', gets: ['Use-case and data review', 'Built into your application', 'Testing and usage limits'],
    industries: [['window', 'Software products', 'Features customers will use'], ['cart', 'E-commerce', 'Smarter search and support'], ['gear', 'Internal tools', 'Less manual work for staff']],
    cta: 'Let’s scope your first feature',
  }),
  film('12', 'Websites', 'Website care', {
    hook: 'Your website, looked after every month.',
    need: ['Updates pile up unnoticed', 'Forms fail without warning', 'The site slowly gets slower'],
    demo: 'uptime', gets: ['Updates and backups', 'Form and uptime checks', 'Performance maintenance'],
    industries: [['shop', 'Small businesses', 'No developer in-house'], ['clinic', 'Clinics', 'Booking forms must work'], ['cart', 'Online stores', 'Downtime means lost orders']],
    cta: 'Let’s agree a care plan',
  }),
  film('13', 'Audits & advisory', 'Website quality review', {
    hook: 'Know exactly what to fix first.',
    need: ['Something feels off, but what?', 'Fixes chosen by guesswork', 'Slow pages on phones'],
    demo: 'audit', gets: ['Mobile and key-flow review', 'Findings ranked by impact', 'A clear fix roadmap'],
    industries: [['cart', 'Online stores', 'Checkout friction costs orders'], ['briefcase', 'Service businesses', 'Enquiry paths must be clear'], ['compass', 'Planning a redesign', 'Know before you rebuild']],
    cta: 'Let’s review your website',
  }),
  film('14', 'Audits & advisory', 'Accessibility', {
    hook: 'Make your website usable by everyone.',
    need: ['Keyboard users get stuck', 'Low contrast hides content', 'Forms confuse screen readers'],
    demo: 'focus', gets: ['Keyboard, focus and forms', 'Contrast and structure', 'Fixes documented and retested'],
    industries: [['columns', 'Public sector', 'Accessibility is expected'], ['school', 'Education', 'Students with every need'], ['clinic', 'Healthcare', 'Patients of all abilities']],
    cta: 'Let’s make it accessible',
  }),
  film('15', 'Audits & advisory', 'Privacy & GDPR readiness', {
    hook: 'Know what your website does with data.',
    need: ['Trackers load before consent', 'Form data is kept forever', 'Nobody knows what is stored'],
    demo: 'consent', gets: ['Tracker and form inventory', 'Consent and script controls', 'Retention and deletion steps'],
    note: 'Legal sign-off stays with your adviser.',
    industries: [['cart', 'Online stores', 'Many trackers and forms'], ['clinic', 'Clinics', 'Sensitive patient enquiries'], ['globe', 'EU-facing businesses', 'Visitors expect careful handling']],
    cta: 'Let’s check your data handling',
  }),
  film('16', 'Audits & advisory', 'AI opportunity review', {
    hook: 'Find the AI step worth taking first.',
    need: ['Ideas everywhere, no plan', 'Pilots that never finish', 'Unclear cost and value'],
    demo: 'target', gets: ['Workflow discovery', 'Cost and feasibility check', 'Pilot success criteria'],
    industries: [['building', 'Growing businesses', 'Limited time to experiment'], ['gear', 'Operations teams', 'Repetitive manual workflows'], ['briefcase', 'Professional services', 'Document-heavy daily work']],
    cta: 'Let’s find your first step',
  }),
  film('17', 'Audits & advisory', 'AI quality & care', {
    hook: 'Keep your AI helpful after launch.',
    need: ['Answers drift over time', 'Model updates change behaviour', 'Costs creep up quietly'],
    demo: 'eval', gets: ['Evaluation examples and tests', 'Usage and failure monitoring', 'Scheduled improvements'],
    industries: [['headset', 'Support teams', 'Answers customers rely on'], ['window', 'Software products', 'AI features in production'], ['shield', 'Regulated sectors', 'Checks you can show']],
    cta: 'Let’s keep your AI on track',
  }),
  film('18', 'Audits & advisory', 'AI adoption & training', {
    hook: 'Help your team use AI with confidence.',
    need: ['Staff unsure what’s allowed', 'Everyone uses AI differently', 'Data pasted where it shouldn’t be'],
    demo: 'workshop', gets: ['Role-specific workshops', 'Clear data handling rules', 'Repeatable ways of working'],
    industries: [['pen', 'Agencies', 'Creative and client work'], ['chart', 'Finance teams', 'Careful data handling'], ['school', 'Schools', 'Staff and classroom guidance']],
    cta: 'Let’s plan your training',
  }),
].map(entry => [entry.id, entry]));
