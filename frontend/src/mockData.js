export const mockUser = {
  id: 'usr_demo_1',
  name: 'Nikhil',
  fullName: 'Alex Morgan',
  email: 'nikk24g@gmail.com',
  secondaryEmail: 'alex@example.com',
  picture: null,
  plan: 'MailPulse Pro',
  quotaUsed: 12480,
  quotaTotal: 50000,
  lastSynced: '5 min ago',
  syncStatus: 'synced',
}

export const mockDashboardStats = [
  { id: 'total', label: 'Total Emails', value: '1,248', change: '+12%', note: 'vs last 30 days', icon: 'Mail', isUp: true },
  { id: 'unread', label: 'Unread Emails', value: '86', change: '+28%', note: 'vs last 30 days', icon: 'Inbox', isUp: false, alert: true },
  { id: 'sent', label: 'Sent Mails', value: '428', change: '+6%', note: 'vs last 30 days', icon: 'Send', isUp: true },
  { id: 'important', label: 'Important Emails', value: '134', change: '+18%', note: 'vs last 30 days', icon: 'Bookmark', isUp: true },
  { id: 'starred', label: 'Starred Emails', value: '76', change: '+5%', note: 'vs last 30 days', icon: 'Star', isUp: true },
  { id: 'actions', label: 'Total Actions Taken', value: '386', change: '+22%', note: 'vs last 30 days', icon: 'Zap', isUp: true },
]

export const mockActivity7Days = [
  { date: 'Oct 4', received: 75, sent: 48 },
  { date: 'Oct 5', received: 85, sent: 42 },
  { date: 'Oct 6', received: 135, sent: 80 },
  { date: 'Oct 7', received: 95, sent: 55 },
  { date: 'Oct 8', received: 142, sent: 68 },
  { date: 'Oct 9', received: 98, sent: 50 },
  { date: 'Oct 10', received: 138, sent: 62 },
]

export const mockActivity30Days = [
  { date: 'Sep 11', received: 42, sent: 18, replies: 12 },
  { date: 'Sep 14', received: 65, sent: 28, replies: 16 },
  { date: 'Sep 17', received: 82, sent: 34, replies: 22 },
  { date: 'Sep 20', received: 55, sent: 22, replies: 14 },
  { date: 'Sep 23', received: 98, sent: 45, replies: 28 },
  { date: 'Sep 26', received: 74, sent: 38, replies: 20 },
  { date: 'Sep 29', received: 110, sent: 52, replies: 34 },
  { date: 'Oct 2', received: 62, sent: 30, replies: 18 },
  { date: 'Oct 5', received: 132, sent: 68, replies: 42 },
  { date: 'Oct 8', received: 142, sent: 74, replies: 46 },
  { date: 'Oct 10', received: 88, sent: 44, replies: 26 },
]

export const mockSentStats = [
  { id: 'total-sent', label: 'Total Sent', value: '428', change: '↑ 12%', icon: 'Send' },
  { id: 'replies-rec', label: 'Replies Received', value: '164', change: '↑ 8%', icon: 'CornerUpLeft' },
  { id: 'starred-sent', label: 'Starred Sent Mails', value: '37', change: '↑ 5%', icon: 'Star' },
  { id: 'important-sent', label: 'Important Sent Mails', value: '52', change: '↑ 18%', icon: 'Bookmark' },
  { id: 'read-known', label: 'Read Status Known', value: '216', change: '↑ 14%', icon: 'Eye' },
]

export const mockMonthlyReportStats = [
  { id: 'received', label: 'Total Received', value: '1,024', change: '↑ 12%', icon: 'Mail', spark: [30, 45, 60, 40, 85, 70, 95] },
  { id: 'sent', label: 'Total Sent', value: '428', change: '↑ 8%', icon: 'Send', spark: [20, 35, 25, 45, 50, 40, 55] },
  { id: 'replied', label: 'Total Replied', value: '164', change: '↑ 15%', icon: 'CornerUpLeft', spark: [10, 18, 14, 25, 28, 22, 32] },
  { id: 'starred', label: 'Total Starred', value: '76', change: '↑ 6%', icon: 'Star', spark: [8, 12, 10, 15, 14, 18, 20] },
  { id: 'actions', label: 'Total Actions Taken', value: '386', change: '↑ 22%', icon: 'Eye', sub: 'Unique emails interacted with during this month.', spark: [40, 50, 65, 55, 75, 80, 90] },
]

export const mockAnalyticsKPIs = [
  { label: 'Emails Received', value: '1,024', change: '↑ 12%', note: 'vs previous 30 days', icon: 'Mail', isUp: true },
  { label: 'Emails Sent', value: '428', change: '↑ 8%', note: 'vs previous 30 days', icon: 'Send', isUp: true },
  { label: 'Replies Received', value: '164', change: '↑ 18%', note: 'vs previous 30 days', icon: 'CornerUpLeft', isUp: true },
  { label: 'Unread Rate', value: '6.8%', change: '↓ 3.2%', note: 'vs previous 30 days', icon: 'Clock', isUp: true },
  { label: 'Starred Emails', value: '76', change: '↓ 27%', note: 'vs previous 30 days', icon: 'Star', isUp: false },
  { label: 'Total Actions Taken', value: '386', change: '↑ 15%', note: 'vs previous 30 days', icon: 'Zap', isUp: true },
]

export const mockEmails = [
  {
    id: 'em-1',
    threadId: 'th-1',
    sender: 'Shreya Gupta',
    senderEmail: 'shreya@designhub.co',
    avatar: 'SG',
    subject: 'Project presentation feedback',
    snippet: "Hey Nikhil, I've reviewed the presentation and overall it looks really strong. The visual direction and story flow are clean and easy to follow...",
    date: '10:42 AM',
    fullDate: 'Today, 10:42 AM',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachment: true,
    category: 'Project',
    to: 'nikk24g@gmail.com',
    body: `Hi Nikhil,

I've reviewed the presentation and overall it looks really strong. The visual direction and story flow are clean and easy to follow.

A few suggestions:
• Add a clearer problem statement slide
• Include user research insights
• Highlight the impact and next steps

Let me know if you'd like to discuss this further. Great work!

Best,
Shreya Gupta
Product Designer
DesignHub`,
    attachments: [
      { name: 'NITYA_Presentation_v2.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Feedback_Notes.txt', size: '12 KB', type: 'TXT' }
    ],
    aiReview: {
      subject: 'Project Presentation Feedback',
      summary: 'The sender has reviewed the project presentation and is requesting updates to the database and analytics sections.',
      keyPoints: [
        'Update the database architecture diagram',
        'Add more details to the analytics section',
        'Submit the revised presentation by Friday'
      ],
      suggestedAction: 'Review the attachment and reply before Friday.',
      category: 'Project',
      priority: 'Important',
      confidence: 'High'
    },
    threadMessages: [
      {
        id: 'msg-1',
        sender: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        avatar: 'R',
        date: 'Sep 28, 2026, 10:14 AM',
        type: 'Received',
        isUnread: true,
        content: `Hi Alex,\n\nThanks for sharing the project presentation. The overall direction looks great and clearly communicates the core idea. I especially liked the problem statement and the user flow section.\n\nI've added a few detailed comments in the attached PDF. Let's discuss these points in our next meeting.\n\nBest,\nRohan`,
        attachments: []
      },
      {
        id: 'msg-2',
        sender: 'Alex Carter',
        email: 'alex@example.com',
        avatar: 'A',
        date: 'Sep 29, 2026, 09:22 AM',
        type: 'Sent',
        isUnread: false,
        content: `Hi Rohan,\n\nThanks for the detailed feedback! I've reviewed the comments and made the suggested changes. I've also updated a few slides based on our discussion yesterday.\n\nAttaching the revised version of the presentation for your review.\n\nRegards,\nAlex`,
        attachments: [{ name: 'presentation.pdf', size: '2.4 MB' }]
      },
      {
        id: 'msg-3',
        sender: 'Priya Sharma',
        email: 'priya.sharma@company.com',
        avatar: 'P',
        date: 'Oct 2, 2026, 04:18 PM',
        type: 'Received',
        isUnread: true,
        content: `Hi Alex,\n\nThis looks much better! The updated flow makes it easier to understand. I've added a few minor suggestions, mostly around the UI screens and naming.\n\nAlso attaching a reference image for the architecture we discussed. Let me know if you need any further inputs.\n\nThanks,\nPriya`,
        attachments: [{ name: 'architecture.png', size: '1.1 MB' }]
      },
      {
        id: 'msg-4',
        sender: 'Alex Carter',
        email: 'alex@example.com',
        avatar: 'A',
        date: 'Oct 5, 2026, 11:03 AM',
        type: 'Sent',
        isUnread: false,
        content: `Thanks Priya!\n\nI've incorporated the changes and updated the final version. Everything should be good to go for the review meeting.\n\nSee you both tomorrow.\nAlex`,
        attachments: []
      }
    ],
    threadMeta: {
      participantsCount: 3,
      messagesCount: 4,
      attachmentsCount: 2,
      toCount: 2,
      ccCount: 3,
      bccCount: 0,
      firstActivity: 'Sep 28, 2026',
      lastActivity: 'Oct 5, 2026',
      participants: [
        { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', avatar: 'R', isUnread: true },
        { name: 'Priya Sharma', email: 'priya.sharma@company.com', avatar: 'P', isUnread: false },
        { name: 'Alex Carter', email: 'alex@example.com', avatar: 'A', isYou: true }
      ]
    }
  },
  {
    id: 'em-2',
    sender: 'Aditya Verma',
    senderEmail: 'aditya.verma@techcorp.in',
    avatar: 'AD',
    subject: 'Database design discussion',
    snippet: "Let's discuss the schema structure for the new microservice. Attached the initial ER diagram...",
    date: '9:18 AM',
    fullDate: 'Today, 9:18 AM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: true,
    category: 'Development',
    to: 'nikk24g@gmail.com',
    body: "Hi team, let's connect today at 4 PM to review the relational database schema and Alembic migrations. Please review the attached entity diagrams beforehand.",
    attachments: [{ name: 'schema_v1.png', size: '1.8 MB', type: 'PNG' }],
    aiReview: {
      subject: 'Database design discussion',
      summary: 'Aditya requested a team sync regarding the database schema design and migrations.',
      keyPoints: ['Sync at 4 PM today', 'Review ER diagram and Alembic script', 'Prepare questions on indexing'],
      suggestedAction: 'Accept meeting invite and review attached ER diagram.',
      category: 'Development',
      priority: 'Normal',
      confidence: 'High'
    }
  },
  {
    id: 'em-3',
    sender: 'Prof. C. Sharma',
    senderEmail: 'csharma@akgec.ac.in',
    avatar: 'PC',
    subject: 'Final year project documentation',
    snippet: 'Please find the updated guidelines for the upcoming phase evaluation and report submission...',
    date: 'Yesterday',
    fullDate: 'Yesterday, 3:30 PM',
    isRead: true,
    isStarred: false,
    isImportant: true,
    hasAttachment: false,
    category: 'Academic',
    to: 'nikk24g@gmail.com',
    body: 'Students must submit phase 1 project reports adhering to the updated IEEE formatting by next Monday. No extensions will be entertained.',
    aiReview: {
      subject: 'Final year project documentation',
      summary: 'Professor Sharma issued mandatory project report submission guidelines with IEEE formatting.',
      keyPoints: ['Adhere strictly to IEEE format', 'Deadline is Monday next week', 'No extensions permitted'],
      suggestedAction: 'Verify formatting and submit draft report.',
      category: 'Academic',
      priority: 'Important',
      confidence: 'High'
    }
  },
  {
    id: 'em-4',
    sender: 'Team at Notion',
    senderEmail: 'team@notion.so',
    avatar: 'TA',
    subject: 'Your weekly productivity summary',
    snippet: "Here's a summary of your activity this week. You completed 18 tasks across 4 workspaces...",
    date: 'Oct 9, 2026',
    fullDate: 'Oct 9, 2026, 8:00 AM',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Update',
    to: 'nikk24g@gmail.com',
    body: "Great job this week! You created 12 new pages, checked off 18 tasks, and collaborated with 5 teammates.",
    aiReview: {
      subject: 'Your weekly productivity summary',
      summary: 'Automated weekly digest detailing workspace activity and productivity metrics.',
      keyPoints: ['18 completed tasks', '12 new pages created', 'Steady momentum'],
      suggestedAction: 'Archive or glance through metrics.',
      category: 'Update',
      priority: 'Low',
      confidence: 'High'
    }
  },
  {
    id: 'em-5',
    sender: 'Research Papers',
    senderEmail: 'noreply@ieee.org',
    avatar: 'RS',
    subject: 'New research paper recommendations',
    snippet: 'Based on your interests, we found 5 new papers in Graph Neural Networks and Transformers...',
    date: 'Oct 9, 2026',
    fullDate: 'Oct 9, 2026, 11:15 AM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Research',
    to: 'nikk24g@gmail.com',
    body: 'Curated list of recent publications on attention mechanisms and representation learning for email semantics.',
    aiReview: {
      subject: 'New research paper recommendations',
      summary: 'Weekly curated literature matching user research profile on AI and NLP.',
      keyPoints: ['5 new papers in IEEE Xplore', 'Focus on Attention and GNNs'],
      suggestedAction: 'Bookmark interesting papers for weekend reading.',
      category: 'Research',
      priority: 'Low',
      confidence: 'Medium'
    }
  },
  {
    id: 'em-6',
    sender: 'Rohan Chawla',
    senderEmail: 'rohan@motionlab.in',
    avatar: 'RC',
    subject: 'Meeting confirmation – Mon, 12 Oct',
    snippet: 'This is to confirm our meeting on Monday at 3:00 PM IST regarding product design prototypes...',
    date: 'Oct 8, 2026',
    fullDate: 'Oct 8, 2026, 6:32 PM',
    isRead: false,
    isStarred: false,
    isImportant: true,
    hasAttachment: false,
    category: 'Meeting',
    to: 'nikk24g@gmail.com',
    body: 'Looking forward to our call on Monday. Link is included in Google Calendar invite. Please bring the interactive prototype links.',
    aiReview: {
      subject: 'Meeting confirmation – Mon, 12 Oct',
      summary: 'Confirmed client meeting scheduled for Monday 3 PM IST.',
      keyPoints: ['Date: Monday, Oct 12', 'Time: 3:00 PM IST', 'Topic: Interactive prototype showcase'],
      suggestedAction: 'Add to calendar and test prototype deployment.',
      category: 'Meeting',
      priority: 'Important',
      confidence: 'High'
    }
  },
  {
    id: 'em-7',
    sender: 'Google Drive',
    senderEmail: 'drive-noreply@google.com',
    avatar: 'GD',
    subject: 'Folder shared with you',
    snippet: 'nitya_prototype_v2 has been shared with you by Sneha Kapoor with edit permissions...',
    date: 'Oct 8, 2026',
    fullDate: 'Oct 8, 2026, 9:01 PM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Shared',
    to: 'nikk24g@gmail.com',
    body: 'Sneha shared "nitya_prototype_v2" folder with you. Click Open in Drive to access design components and assets.',
    aiReview: {
      subject: 'Folder shared with you',
      summary: 'New Google Drive shared folder invitation from Sneha Kapoor.',
      keyPoints: ['Shared asset folder: nitya_prototype_v2', 'Editor access granted'],
      suggestedAction: 'Open folder and verify access.',
      category: 'Shared',
      priority: 'Normal',
      confidence: 'High'
    }
  },
  {
    id: 'em-8',
    sender: 'Saurabh Singh',
    senderEmail: 'saurabh.s@techcorp.in',
    avatar: 'SF',
    subject: 'UI components for NITYA app',
    snippet: 'Attaching the latest component library. Please review the button states, badges, and dark tokens...',
    date: 'Oct 8, 2026',
    fullDate: 'Oct 8, 2026, 2:15 PM',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachment: true,
    category: 'Design',
    to: 'nikk24g@gmail.com',
    body: 'Hey Nikhil, here is the export of the design tokens and component specs for our application dashboard. Let me know if you need SVG assets.',
    attachments: [{ name: 'components_spec.fig', size: '8.4 MB', type: 'FIG' }],
    aiReview: {
      subject: 'UI components for NITYA app',
      summary: 'Design delivery containing dark theme design tokens and UI specs.',
      keyPoints: ['Component states finalized', 'Tokens align with OLED palette', 'Figma spec attached'],
      suggestedAction: 'Integrate updated styles into CSS design tokens.',
      category: 'Design',
      priority: 'Normal',
      confidence: 'High'
    }
  },
  {
    id: 'em-9',
    sender: 'LinkedIn',
    senderEmail: 'notifications@linkedin.com',
    avatar: 'LP',
    subject: 'Nikhil, you have 3 new messages',
    snippet: "See what's happening with your network. Technical recruiter from Stripe viewed your profile...",
    date: 'Oct 7, 2026',
    fullDate: 'Oct 7, 2026, 5:10 PM',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Social',
    to: 'nikk24g@gmail.com',
    body: 'You received 3 direct messages and 12 profile views this week.',
    aiReview: {
      subject: 'Nikhil, you have 3 new messages',
      summary: 'Social digest notifying about incoming messages and recruitment inquiries.',
      keyPoints: ['3 direct messages pending', 'Recruiter interaction'],
      suggestedAction: 'Log in to LinkedIn to respond.',
      category: 'Social',
      priority: 'Low',
      confidence: 'Medium'
    }
  },
  {
    id: 'em-10',
    sender: 'GitHub',
    senderEmail: 'noreply@github.com',
    avatar: 'GR',
    subject: 'Pull request merged',
    snippet: 'The pull request in 24nikk/portfolio has been merged into main by automerge bot...',
    date: 'Oct 7, 2026',
    fullDate: 'Oct 7, 2026, 1:45 PM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Development',
    to: 'nikk24g@gmail.com',
    body: 'PR #14: "Add dark mode responsive animations and chart visualizers" has been merged.',
    aiReview: {
      subject: 'Pull request merged',
      summary: 'CI/CD notification confirming automatic merge of PR #14 into production branch.',
      keyPoints: ['Merged cleanly', 'Production deploy triggered'],
      suggestedAction: 'No action needed.',
      category: 'Development',
      priority: 'Low',
      confidence: 'High'
    }
  },
  {
    id: 'em-11',
    sender: 'Medium Daily Digest',
    senderEmail: 'noreply@medium.com',
    avatar: 'MC',
    subject: '5 design articles for you this week',
    snippet: 'Stories: The future of automotive HMI, Designing with High Contrast Dark Themes, and Vite 6...',
    date: 'Oct 7, 2026',
    fullDate: 'Oct 7, 2026, 9:20 AM',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Reading',
    to: 'nikk24g@gmail.com',
    body: 'Handpicked articles on modern user interfaces, micro-interactions, and reactive state architectures.',
    aiReview: {
      subject: '5 design articles for you this week',
      summary: 'Reading digest featuring UX trends and frontend architectures.',
      keyPoints: ['Automotive HMI', 'Modern Dark Patterns', 'Vite tooling'],
      suggestedAction: 'Archive or read at leisure.',
      category: 'Reading',
      priority: 'Low',
      confidence: 'High'
    }
  },
  {
    id: 'em-12',
    sender: 'Eventbrite',
    senderEmail: 'noreply@eventbrite.com',
    avatar: 'EV',
    subject: 'Your event registration is confirmed',
    snippet: "You're all set for AI Expo 2026. Here are the access pass details and venue directions...",
    date: 'Oct 6, 2026',
    fullDate: 'Oct 6, 2026, 4:00 PM',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachment: false,
    category: 'Events',
    to: 'nikk24g@gmail.com',
    body: 'Registration confirmed for AI Summit & Expo 2026. Your digital badge QR is enclosed.',
    aiReview: {
      subject: 'Your event registration is confirmed',
      summary: 'Ticket confirmation for AI Expo 2026.',
      keyPoints: ['Registration Confirmed', 'QR code pass attached'],
      suggestedAction: 'Save QR pass to wallet.',
      category: 'Events',
      priority: 'Normal',
      confidence: 'High'
    }
  }
]

export const mockSentEmails = [
  {
    id: 'sent-1',
    recipient: 'Sarah Chen',
    recipientEmail: 'sarah.chen@designco.com',
    avatar: 'SC',
    subject: 'Project feedback request',
    preview: "Hi Sarah, I've shared the initial design concepts for review...",
    sentDate: 'Oct 28, 2026 10:24 AM',
    replyStatus: 'Reply received',
    readReceiptStatus: 'Read receipt received',
    isStarred: true,
    isImportant: false,
    attachmentsCount: 2
  },
  {
    id: 'sent-2',
    recipient: 'Aarav Mehta',
    recipientEmail: 'aarav@buildlabs.io',
    avatar: 'AM',
    subject: 'Database documentation',
    preview: 'Attaching the updated database documentation and schema diagrams...',
    sentDate: 'Oct 27, 2026 4:18 PM',
    replyStatus: 'No reply yet',
    readReceiptStatus: 'Read receipt received',
    isStarred: false,
    isImportant: true,
    attachmentsCount: 1
  },
  {
    id: 'sent-3',
    recipient: 'Professor Rao',
    recipientEmail: 'rao@college.edu',
    avatar: 'PR',
    subject: 'Final report submission',
    preview: 'Dear Professor, Please find the final report enclosed for evaluation...',
    sentDate: 'Oct 26, 2026 11:03 AM',
    replyStatus: 'Reply received',
    readReceiptStatus: 'No read receipt',
    isStarred: false,
    isImportant: true,
    attachmentsCount: 3
  },
  {
    id: 'sent-4',
    recipient: 'Team Mailbox',
    recipientEmail: 'team@company.com',
    avatar: 'TM',
    subject: 'Meeting confirmation',
    preview: 'Confirming our meeting for tomorrow at 11 AM with engineering team...',
    sentDate: 'Oct 25, 2026 6:42 PM',
    replyStatus: 'Reply received',
    readReceiptStatus: 'Read status unknown',
    isStarred: true,
    isImportant: true,
    attachmentsCount: 0
  },
  {
    id: 'sent-5',
    recipient: 'Design Systems',
    recipientEmail: 'design@product.io',
    avatar: 'DS',
    subject: 'UI assets handover',
    preview: 'Here are the final UI assets for the dashboard and color palette...',
    sentDate: 'Oct 24, 2026 2:15 PM',
    replyStatus: 'No reply yet',
    readReceiptStatus: 'No read receipt',
    isStarred: false,
    isImportant: false,
    attachmentsCount: 5
  },
  {
    id: 'sent-6',
    recipient: 'Kavya Luthra',
    recipientEmail: 'kavya@marketing.co',
    avatar: 'KL',
    subject: 'Campaign discussion',
    preview: "Let's discuss the upcoming campaign and creative direction on Tuesday...",
    sentDate: 'Oct 23, 2026 1:32 PM',
    replyStatus: 'Reply received',
    readReceiptStatus: 'Read receipt received',
    isStarred: false,
    isImportant: true,
    attachmentsCount: 1
  },
  {
    id: 'sent-7',
    recipient: 'Rohit Patel',
    recipientEmail: 'rohit@partner.com',
    avatar: 'RP',
    subject: 'Partnership proposal',
    preview: 'Sharing the partnership proposal for your review and legal approval...',
    sentDate: 'Oct 22, 2026 5:07 PM',
    replyStatus: 'No reply yet',
    readReceiptStatus: 'Read status unknown',
    isStarred: false,
    isImportant: false,
    attachmentsCount: 2
  },
  {
    id: 'sent-8',
    recipient: 'Nisha Sharma',
    recipientEmail: 'nisha@research.org',
    avatar: 'NS',
    subject: 'User research insights',
    preview: 'Attaching the user research summary and benchmark metrics...',
    sentDate: 'Oct 21, 2026 12:46 PM',
    replyStatus: 'Reply received',
    readReceiptStatus: 'No read receipt',
    isStarred: true,
    isImportant: true,
    attachmentsCount: 4
  }
]

export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'reply',
    title: 'Reply received',
    desc: 'Sarah Chen replied to "Project Presentation Feedback."',
    time: '10 min ago',
    unread: true,
    category: 'email',
    actionText: 'View Email'
  },
  {
    id: 'notif-2',
    type: 'read',
    title: 'Read receipt received',
    desc: 'A read receipt was received for "Database Documentation."',
    time: '42 min ago',
    unread: true,
    category: 'email',
    actionText: 'View Email'
  },
  {
    id: 'notif-3',
    type: 'sync',
    title: 'Sync completed',
    desc: '1,248 emails were processed successfully.',
    time: '2 hours ago',
    unread: false,
    category: 'sync',
    actionText: 'View Details'
  },
  {
    id: 'notif-4',
    type: 'flag',
    title: 'Important email detected',
    desc: 'A message from Prof. C. Sharma was marked important.',
    time: '4 hours ago',
    unread: true,
    category: 'email',
    actionText: 'View Email'
  },
  {
    id: 'notif-5',
    type: 'error',
    title: 'Sync failed',
    desc: 'Gmail synchronization could not be completed. Please check your connection.',
    time: '6 hours ago',
    unread: true,
    category: 'sync',
    actionText: 'Retry'
  },
  {
    id: 'notif-6',
    type: 'inbox',
    title: 'Unread inbox reminder',
    desc: 'You have 86 unread emails.',
    time: '8 hours ago',
    unread: true,
    category: 'system',
    actionText: 'View Inbox'
  }
]

export const mockTopCorrespondences = [
  { rank: 1, name: 'Rohan Mehta', email: 'rohan.mehta@example.com', avatar: 'R', total: 186, received: 112, sent: 74, replies: 38, lastActivity: 'Sep 30, 2026', activityPct: 92 },
  { rank: 2, name: 'Priya Sharma', email: 'priya.sharma@company.com', avatar: 'P', total: 142, received: 89, sent: 53, replies: 27, lastActivity: 'Sep 29, 2026', activityPct: 78 },
  { rank: 3, name: 'Google', email: 'no-reply@google.com', avatar: 'G', total: 128, received: 118, sent: 10, replies: 8, lastActivity: 'Sep 30, 2026', activityPct: 71 },
  { rank: 4, name: 'Alex Carter', email: 'alex@example.com', avatar: 'A', total: 96, received: 54, sent: 42, replies: 18, lastActivity: 'Sep 28, 2026', activityPct: 56 },
  { rank: 5, name: 'Team MailPulse', email: 'team@mailpulse.com', avatar: 'T', total: 87, received: 62, sent: 25, replies: 12, lastActivity: 'Sep 27, 2026', activityPct: 48 },
  { rank: 6, name: 'Nitya Team', email: 'nitya@project.com', avatar: 'N', total: 76, received: 41, sent: 35, replies: 14, lastActivity: 'Sep 26, 2026', activityPct: 42 },
  { rank: 7, name: 'Meera Singh', email: 'meera.singh@example.com', avatar: 'M', total: 64, received: 38, sent: 26, replies: 11, lastActivity: 'Sep 24, 2026', activityPct: 35 },
  { rank: 8, name: 'Arjun Kapoor', email: 'arjun.kapoor@example.com', avatar: 'A', total: 58, received: 31, sent: 27, replies: 9, lastActivity: 'Sep 22, 2026', activityPct: 32 },
  { rank: 9, name: 'Saurabh Verma', email: 'saurabh.verma@example.com', avatar: 'S', total: 49, received: 28, sent: 21, replies: 7, lastActivity: 'Sep 20, 2026', activityPct: 28 },
  { rank: 10, name: 'LinkedIn', email: 'notifications@linkedin.com', avatar: 'L', total: 46, received: 40, sent: 6, replies: 4, lastActivity: 'Sep 19, 2026', activityPct: 25 }
]

export const mockSyncHistory = [
  { id: 'sync-1', type: 'Initial sync', subType: 'Full mailbox sync', status: 'Completed', started: 'Oct 6, 2026 10:42 AM', emailsProcessed: '1,248', duration: '8 min 24 sec' },
  { id: 'sync-2', type: 'Manual sync', subType: 'Incremental sync', status: 'Completed', started: 'Oct 3, 2026 02:17 PM', emailsProcessed: '320', duration: '2 min 11 sec' },
  { id: 'sync-3', type: 'Scheduled sync', subType: 'Daily sync', status: 'Partial', started: 'Oct 2, 2026 01:00 AM', emailsProcessed: '186', duration: '1 min 45 sec' },
  { id: 'sync-4', type: 'Manual sync', subType: 'Incremental sync', status: 'Failed', started: 'Sep 29, 2026 11:26 AM', emailsProcessed: '0', duration: '32 sec' }
]
