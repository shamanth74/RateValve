import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Globe, ShieldAlert, Activity } from "lucide-react"
import { fetchUserById } from "@/api/admin.api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserDetailModal({ userId, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetchUserById(userId)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [userId])

  if (!userId) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading user details...
            </div>
          ) : !data ? (
            <div className="p-10 text-center text-red-500">
              Failed to load user.
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold">{data.user.email}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        data.user.tier === "PRO"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {data.user.tier}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        data.user.is_blocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {data.user.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 px-6 py-4">
                <MiniStat
                  icon={<Activity className="h-4 w-4" />}
                  label="Rate Limit Hits"
                  value={data.analytics.rateLimitHits}
                  variant="red"
                />
                <MiniStat
                  icon={<Globe className="h-4 w-4" />}
                  label="Endpoints Used"
                  value={data.analytics.endpoints.length}
                  variant="blue"
                />
                <MiniStat
                  icon={<Clock className="h-4 w-4" />}
                  label="Joined"
                  value={new Date(data.user.created_at).toLocaleDateString()}
                  variant="neutral"
                />
              </div>

              {/* Endpoints Used */}
              <div className="px-6 pb-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Endpoint Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {data.analytics.endpoints.length === 0 ? (
                      <p className="text-xs text-gray-400">No data yet</p>
                    ) : (
                      data.analytics.endpoints.map((ep) => (
                        <div
                          key={ep.endpoint}
                          className="flex items-center justify-between text-sm py-1 border-b last:border-none"
                        >
                          <span className="font-medium truncate">
                            {ep.endpoint}
                          </span>
                          <span className="text-gray-500 font-semibold">
                            {ep.count}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Request History */}
              <div className="px-6 pb-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">
                      Recent Requests (last 50)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-500 border-b pb-2">
                      <div>Endpoint</div>
                      <div>Status</div>
                      <div>Time</div>
                    </div>
                    {data.analytics.logs.length === 0 ? (
                      <p className="text-xs text-gray-400 py-3">
                        No requests yet
                      </p>
                    ) : (
                      data.analytics.logs.map((log) => (
                        <div
                          key={log.id}
                          className="grid grid-cols-3 gap-4 py-2 text-sm border-b last:border-none items-center"
                        >
                          <div className="truncate font-medium">
                            {log.endpoint}
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                                log.status === "ALLOWED"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {log.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* Mini stat card — reuses green/red/blue badge style from existing design */
const MiniStat = ({ icon, label, value, variant = "neutral" }) => {
  const styles = {
    neutral: "bg-gray-50",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
  }

  return (
    <div className={`rounded-lg p-3 ${styles[variant]}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium opacity-70 mb-1">
        {icon}
        {label}
      </div>
      <p className="text-lg font-bold">{value}</p>
    </div>
  )
}
