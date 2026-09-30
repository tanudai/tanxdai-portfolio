// Example walkthroughs for the AI services: shown in the service dialog so a visitor sees what they would get.
// Illustrative only (labelled "Example" in the UI). Steps: msg (who + side), event (system notice), card (result), done (outcome).
export const walkthroughs = {
  '01': { label: 'Example enquiry', steps: [
    { type: 'msg', side: 'them', who: 'Visitor', text: 'Do you make custom faucets for hotels? We need about 400.' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'We do. Which finish, and when do you need them delivered?' },
    { type: 'msg', side: 'them', who: 'Visitor', text: 'Brushed gold, by March.' },
    { type: 'card', title: 'Qualified lead', rows: [['Need', '400 custom faucets'], ['Finish', 'Brushed gold'], ['Deadline', 'March'], ['Fit', 'High']] },
    { type: 'done', text: 'Handed to your sales team with the summary' },
  ] },
  '02': { label: 'Example brief', steps: [
    { type: 'msg', side: 'them', who: 'Customer', text: '2,000 printed tote bags, two colours, delivered in six weeks.' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'Checked against your price list. Which fabric weight?' },
    { type: 'msg', side: 'them', who: 'Customer', text: 'Heavy cotton, 280 gsm.' },
    { type: 'card', title: 'Draft quote', rows: [['Items', '2,000 tote bags'], ['Spec', '280 gsm, 2-colour'], ['Lead time', '6 weeks'], ['Status', 'Awaiting approval']] },
    { type: 'done', text: 'Your team approves before anything is sent' },
  ] },
  '03': { label: 'Example question', steps: [
    { type: 'msg', side: 'them', who: 'Team member', text: 'What is our refund window for custom orders?' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: '14 days, as long as production has not started.' },
    { type: 'card', title: 'Source', rows: [['Document', 'Returns policy'], ['Section', '4.2 Custom orders'], ['Access', 'Staff only']] },
    { type: 'done', text: 'Every answer links to where it came from' },
  ] },
  '04': { label: 'Example document', steps: [
    { type: 'event', text: 'Invoice received: INV-2291.pdf' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'Read 6 fields. The tax amount is unclear, so I flagged it.' },
    { type: 'card', title: 'Extracted data', rows: [['Supplier', 'Northwind Ltd'], ['Total', '₹48,200'], ['Due', '15 Nov'], ['Tax', 'Needs review']] },
    { type: 'done', text: 'Unclear fields go to a person before export' },
  ] },
  '05': { label: 'Example ticket', steps: [
    { type: 'msg', side: 'them', who: 'Customer', text: 'My order arrived damaged. Can I get a replacement?' },
    { type: 'msg', side: 'ai', who: 'Copilot', text: 'Drafted a reply from your replacement policy for your agent.' },
    { type: 'card', title: 'Ticket', rows: [['Category', 'Damaged item'], ['Priority', 'High'], ['Policy', 'Replace within 30 days'], ['Reply', 'Draft ready']] },
    { type: 'done', text: 'Your agent reviews, edits and sends' },
  ] },
  '06': { label: 'Example follow-up', steps: [
    { type: 'event', text: 'New website enquiry received' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'Summarised it and matched an existing contact in your CRM.' },
    { type: 'card', title: 'CRM update', rows: [['Contact', 'Existing hotel client'], ['Summary', 'Wants 3 room mock-ups'], ['Owner', 'Assigned to sales'], ['Follow-up', 'Draft for Thursday']] },
    { type: 'done', text: 'Nothing is sent until someone approves it' },
  ] },
  '07': { label: 'Example search', steps: [
    { type: 'msg', side: 'them', who: 'Visitor', text: 'I need a faucet for a small hotel bathroom, under ₹5,000.' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'Two fit. Wall-mounted or deck-mounted?' },
    { type: 'msg', side: 'them', who: 'Visitor', text: 'Wall-mounted.' },
    { type: 'card', title: 'Best match', rows: [['Product', 'Compact wall mixer'], ['Price', 'Within budget'], ['Why', 'Fits small basins']] },
    { type: 'done', text: 'Shortlist shared with your sales team' },
  ] },
  '08': { label: 'Example report', steps: [
    { type: 'event', text: 'Monthly sales sheet and 3 client notes added' },
    { type: 'msg', side: 'ai', who: 'Assistant', text: 'Drafted the monthly summary and linked every figure to its file.' },
    { type: 'card', title: 'Draft report', rows: [['Sections', 'Sales, products, risks'], ['Sources', '4 files linked'], ['Status', 'Awaiting approval']] },
    { type: 'done', text: 'Published only after your approval' },
  ] },
};
