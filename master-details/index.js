const mockEmails = [
  {
    id: 1,
    sender: "alice@company.com",
    subject: "Project Update - Q4 Planning",
    preview: "Hi team, I wanted to share the latest updates on our Q4 planning initiatives...",
    body: "Hi team,\n\nI wanted to share the latest updates on our Q4 planning initiatives. We've made significant progress on the roadmap and I'd like to schedule a meeting to discuss the next steps.\n\nKey updates:\n• Marketing campaign is on track for October launch\n• Development team has completed 80% of features\n• Budget allocation approved for additional resources\n\nLet me know your availability for next week.\n\nBest regards,\nAlice",
    timestamp: "2024-01-15T10:30:00Z",
    read: false
  },
  {
    id: 2,
    sender: "bob@client.com",
    subject: "Meeting Follow-up: Contract Discussion",
    preview: "Thank you for the productive meeting yesterday. As discussed, I'm sending over...",
    body: "Dear Team,\n\nThank you for the productive meeting yesterday. As discussed, I'm sending over the contract details for your review.\n\nPlease find the key points:\n• Contract duration: 12 months\n• Deliverable timeline: 6 weeks\n• Payment terms: Net 30\n• Scope includes design and development\n\nI look forward to your feedback by Friday.\n\nBest,\nBob",
    timestamp: "2024-01-14T14:15:00Z",
    read: true
  },
  {
    id: 3,
    sender: "carol@vendor.com",
    subject: "Invoice #INV-2024-001",
    preview: "Please find attached invoice for services rendered in December...",
    body: "Hello,\n\nPlease find attached invoice #INV-2024-001 for services rendered in December.\n\nInvoice Details:\n• Amount: $2,500.00\n• Due Date: February 15, 2024\n• Services: Web development consultation\n• Hours: 50 hours @ $50/hour\n\nPlease process payment at your earliest convenience.\n\nThanks,\nCarol",
    timestamp: "2024-01-13T09:00:00Z",
    read: true
  },
  {
    id: 4,
    sender: "david@support.com",
    subject: "System Maintenance Scheduled",
    preview: "We will be performing scheduled maintenance on our servers this weekend...",
    body: "Dear Users,\n\nWe will be performing scheduled maintenance on our servers this weekend from Saturday 2:00 AM to Sunday 6:00 AM EST.\n\nDuring this time:\n• Email services may be temporarily unavailable\n• Some features may experience reduced performance\n• Data backup will be performed\n\nWe apologize for any inconvenience and appreciate your patience.\n\nSupport Team",
    timestamp: "2024-01-12T16:45:00Z",
    read: false
  },
  {
    id: 5,
    sender: "emma@newsletter.com",
    subject: "Weekly Tech Newsletter - AI Trends",
    preview: "This week's edition covers the latest developments in artificial intelligence...",
    body: "Hello Tech Enthusiasts,\n\nThis week's edition covers the latest developments in artificial intelligence and machine learning.\n\nHighlights:\n• OpenAI releases new GPT model with enhanced capabilities\n• Google announces breakthrough in quantum computing\n• Microsoft integrates AI into Office suite\n• Startups raise $2B in AI funding this quarter\n\nRead the full newsletter at our website.\n\nStay innovative!\nEmma",
    timestamp: "2024-01-11T08:00:00Z",
    read: true
  }
];


const fetchEmails = async () => {
   return new Promise((resolve, reject) => {
       setTimeout(() => {
           resolve(mockEmails);
       }, 500); 
   });
};


const fetchEmailById = async (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const email = mockEmails.find(email => email.id === parseInt(id));
            if (email) {
                resolve(email);
            } else {
                reject(new Error('Email not found'));
            }
        }, 200);
    });
};


const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
};


let currentEmails = [];
let selectedEmailId = null;


let emailList;
let emailDetail;
let loadingIndicator;


const initApp = async () => {
    emailList = document.getElementById('email-list');
    emailDetail = document.getElementById('email-detail');
    loadingIndicator = document.getElementById('loading');
    
    await loadEmails();
};


const loadEmails = async () => {
    try {
        showLoading(true);
        currentEmails = await fetchEmails();
        renderEmailList();
        showLoading(false);
    } catch (error) {
        console.error('Failed to load emails:', error);
        showLoading(false);
    }
};


const renderEmailList = () => {
    emailList.innerHTML = '';
    
    currentEmails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.className = `email-item ${!email.read ? 'unread' : ''} ${selectedEmailId === email.id ? 'selected' : ''}`;
        emailItem.onclick = () => selectEmail(email.id);
        
        emailItem.innerHTML = `
            <div class="email-header">
                <span class="sender">${email.sender}</span>
                <span class="timestamp">${formatTimestamp(email.timestamp)}</span>
            </div>
            <div class="subject">${email.subject}</div>
            <div class="preview">${email.preview}</div>
            ${!email.read ? '<div class="unread-indicator"></div>' : ''}
        `;
        
        emailList.appendChild(emailItem);
    });
};


const selectEmail = async (emailId) => {
    try {
        selectedEmailId = emailId;
        renderEmailList();
        
        const email = await fetchEmailById(emailId);
        renderEmailDetail(email);
        // marking as read
        const emailIndex = currentEmails.findIndex(e => e.id === emailId);
        if (emailIndex !== -1 && !currentEmails[emailIndex].read) {
            currentEmails[emailIndex].read = true;
            renderEmailList();
        }
    } catch (error) {
        console.error('Failed to load email:', error);
    }
};


const renderEmailDetail = (email) => {
    emailDetail.innerHTML = `
        <div class="email-detail-header">
            <h2>${email.subject}</h2>
            <div class="email-meta">
                <span class="sender-detail">From: ${email.sender}</span>
                <span class="timestamp-detail">${formatTimestamp(email.timestamp)}</span>
            </div>
        </div>
        <div class="email-body">
            ${email.body.replace(/\n/g, '<br>')}
        </div>
    `;
};


const showLoading = (show) => {
    loadingIndicator.style.display = show ? 'block' : 'none';
};


document.addEventListener('DOMContentLoaded', initApp);