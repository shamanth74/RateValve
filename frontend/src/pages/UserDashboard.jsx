import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "@/components/Navbar"
import { testApiRequest } from "@/api/user.api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const apiKey = user?.apiKey
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) navigate("/")
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
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Rate limit exceeded"
      )
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
          {/* API KEY */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Key</CardTitle>
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
                  Requests are rate limited (10 requests/minute)
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
