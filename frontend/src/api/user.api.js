import api from "./axios"

export const testApiRequest = (apiKey) => {
  return api.get("/api/data", {
    headers: {
      "x-api-key": apiKey,
    },
  })
}