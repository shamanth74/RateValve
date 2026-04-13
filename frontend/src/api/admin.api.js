import api from "./axios"

// Analytics (updated path — moved from /admin/usage to /admin/analytics/usage)
export const fetchAnalytics = () => api.get("/admin/analytics/usage")

// Admin user management APIs
export const fetchAllUsers = () => api.get("/admin/users")
export const fetchUserById = (id) => api.get(`/admin/users/${id}`)
export const updateUserTier = (id, tier) =>
  api.patch(`/admin/users/${id}/tier`, { tier })
export const blockUser = (id) => api.patch(`/admin/users/${id}/block`)
export const unblockUser = (id) => api.patch(`/admin/users/${id}/unblock`)
