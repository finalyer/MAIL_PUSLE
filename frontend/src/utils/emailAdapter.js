/**
 * Utility to adapt backend API email objects to the format expected by the MailPulse UI.
 */

export function formatEmailForUI(item, currentUserEmail = '') {
  if (!item) return null

  const senderName =
    item.sender_name?.trim() ||
    (item.sender_email ? item.sender_email.split('@')[0] : 'Unknown Sender')

  // Generate 2-letter initials
  const initials = senderName
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'M'

  // Format date display
  const rawDate = item.gmail_internal_date || item.created_at
  const dateObj = rawDate ? new Date(rawDate) : new Date()
  const isToday = new Date().toDateString() === dateObj.toDateString()
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })
  const displayDate = isToday ? timeStr : dateStr
  const fullDate = `${dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}, ${timeStr}`

  // Derive human category
  let category = 'Inbox'
  const labels = item.label_ids || []
  if (labels.includes('CATEGORY_PROMOTIONS')) category = 'Promotions'
  else if (labels.includes('CATEGORY_UPDATES')) category = 'Updates'
  else if (labels.includes('CATEGORY_SOCIAL')) category = 'Social'
  else if (labels.includes('CATEGORY_FORUMS')) category = 'Forums'
  else if (labels.includes('IMPORTANT') || item.is_important) category = 'Important'
  else if (item.direction === 'sent') category = 'Sent'

  // Derive AI review summary
  const cleanSnippet = item.snippet?.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&') || ''
  const aiSummary = cleanSnippet || item.subject || 'Standard email correspondence.'
  
  const keyPoints = []
  if (item.subject) keyPoints.push(`Subject: ${item.subject}`)
  if (cleanSnippet) {
    keyPoints.push(cleanSnippet.length > 90 ? cleanSnippet.slice(0, 90) + '...' : cleanSnippet)
  }
  if (item.has_attachments) {
    keyPoints.push('Contains file attachments requiring review.')
  }

  // Format recipient
  const recipientList = Array.isArray(item.recipient_emails) ? item.recipient_emails : []
  const recipientDisplay = recipientList[0] || currentUserEmail || 'me'

  return {
    id: item.id,
    threadId: item.thread_id || item.id,
    gmailMessageId: item.gmail_message_id,
    sender: senderName,
    senderEmail: item.sender_email || 'unknown@domain.com',
    avatar: initials,
    subject: item.subject || '(No subject)',
    snippet: cleanSnippet,
    date: displayDate,
    fullDate: fullDate,
    rawDate: dateObj,
    isRead: Boolean(item.is_read),
    isStarred: Boolean(item.is_starred),
    isImportant: Boolean(item.is_important),
    hasAttachment: Boolean(item.has_attachments),
    category: category,
    direction: item.direction || 'received',
    to: recipientDisplay,
    body: item.body_text || cleanSnippet || '(No content available)',
    attachments: (item.attachments && item.attachments.length > 0)
      ? item.attachments.map(att => ({
          name: att.filename || 'Attachment',
          size: att.size_bytes ? `${Math.round(att.size_bytes / 1024)} KB` : 'Document',
          type: att.mime_type || 'FILE'
        }))
      : (item.has_attachments ? [{ name: 'Attached file', size: 'Document', type: 'FILE' }] : []),
    aiReview: {
      subject: item.subject || 'Email Review',
      summary: aiSummary,
      keyPoints: keyPoints.length > 0 ? keyPoints : ['Review message contents and follow up if needed.'],
      suggestedAction: item.direction === 'sent'
        ? 'Archived in Sent mailbox.'
        : item.is_important
          ? 'Priority follow-up recommended.'
          : 'Standard message; review and reply when available.',
      category: category,
      priority: item.is_important ? 'Important' : 'Normal',
      confidence: '95%'
    },
    threadMessages: [
      {
        id: `msg-${item.id}`,
        sender: senderName,
        email: item.sender_email || '',
        avatar: initials,
        date: fullDate,
        type: item.direction === 'sent' ? 'Sent' : 'Received',
        isUnread: !item.is_read,
        content: item.body_text || cleanSnippet || '(No content available)',
        attachments: (item.attachments || []).map(att => ({
          name: att.filename || 'Attachment',
          size: att.size_bytes ? `${Math.round(att.size_bytes / 1024)} KB` : 'Document'
        }))
      }
    ]
  }
}
