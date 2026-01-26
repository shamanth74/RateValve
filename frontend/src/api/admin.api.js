import api from "./axios"

export const fetchAnalytics = () => {
  return api.get("/admin/usage")
}
