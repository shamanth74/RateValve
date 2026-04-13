import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Copy, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "@/components/Navbar"
import { testApiRequest, fetchMe } from "@/api/user.api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const TIER_INFO = {
  FREE: { label: "Free Plan", limit: "10 req/min", color: "bg-gray-100 text-gray-700" },
  PRO: { label: "Pro Plan", limit: "50 req/min", color: "bg-blue-100 text-blue-700" },
}

export default function UserDashboard() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  )
  const apiKey = currentUser?.apiKey

  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState("")

  const tier = currentUser?.tier || "FREE"
  const tierInfo = TIER_INFO[tier] || TIER_INFO.FREE

  // Fetch fresh user profile on mount — keeps tier & block status in sync
  useEffect(() => {
    if (!currentUser) {
      navigate("/")
      return
    }

    fetchMe()
      .then((res) => {
        const freshUser = res.data.user
        // Update localStorage so it stays fresh
        localStorage.setItem("user", JSON.stringify(freshUser))
        setCurrentUser(freshUser)
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err)
      })
  }, [])

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sendRequest = async () => {
    setLoading(true)
    setError("")
    setResponse(null)

    try {
      const res = await testApiRequest(apiKey)
      setResponse(res.data)
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.error === "BLOCKED") {
        setError("Your account has been blocked. Contact support.")
      } else {
        setError(
          err.response?.data?.msg ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Rate limit exceeded"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* BLOCKED BANNER */}
          {currentUser?.is_blocked && (
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription className="text-red-700 font-medium">
                Your account has been blocked. API requests will be rejected.
                Please contact support.
              </AlertDescription>
            </Alert>
          )}

          {/* API KEY + TIER */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your API Key</CardTitle>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tierInfo.color}`}>
                  {tierInfo.label} — {tierInfo.limit}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <code className="bg-gray-100 px-3 py-2 rounded text-sm break-all">
                {apiKey}
              </code>
              <Button onClick={copyKey} variant="outline">
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>

          {/* HOW TO USE API */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use the API</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Send requests to <code className="bg-gray-100 px-1 rounded">/api/data</code>
                </li>
                <li>
                  Include your API key in header:
                  <code className="bg-gray-100 px-1 ml-1 rounded">x-api-key</code>
                </li>
                <li>
                  Requests are rate limited ({tierInfo.limit})
                </li>
              </ul>

              <pre className="bg-gray-100 p-3 rounded text-xs mt-3 overflow-x-auto">
{`curl -X GET http://localhost:3000/api/data \\
-H "x-api-key: YOUR_API_KEY"`}
              </pre>
            </CardContent>
          </Card>

          {/* TEST API */}
          <Card>
            <CardHeader>
              <CardTitle>Test API Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={sendRequest} disabled={loading}>
                {loading ? "Sending..." : "Send Request"}
              </Button>

              {response && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Request Successful
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* API RESPONSE */}
              {response && (
                <div>
                  <p className="text-sm font-medium mb-2">API Response</p>
                  <pre className="bg-gray-900 text-green-200 p-4 rounded text-xs overflow-x-auto">
{JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
