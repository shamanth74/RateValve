import api from "./axios"

export const signup = (email, password) => {
  return api.post("/api/auth/signup", { email, password })
}

export const login = (email, password, role) => {
  return api.post("/api/auth/login", { email, password, role })
}
