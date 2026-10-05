import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Auth
export const getMe = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')
export const googleLoginUrl = '/api/auth/google'

// Threads — returns { items, total, page, page_size, pages }
export const getThreads = (params) => api.get('/threads', { params })
export const getThread = (id) => api.get(`/threads/${id}`)

// Emails — returns { items, total, page, page_size, pages }
export const getEmails = (params) => api.get('/emails', { params })
export const getEmail = (id) => api.get(`/emails/${id}`)

// Search — returns { items, total, page, page_size, pages }
export const search = (q, params = {}) => api.get('/search', { params: { q, ...params } })

// Analytics — returns { success, data: {...}, account: {...} }
export const getAnalytics = () => api.get('/analytics/overview')

// Sync
export const getSyncStatus = () => api.get('/sync/status')
export const triggerSync = () => api.post('/sync/trigger')
export const getSyncJobs = () => api.get('/sync/jobs')

export default api
