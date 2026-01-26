import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import Navbar from "@/components/Navbar"
import { fetchAnalytics } from "@/api/admin.api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || user.role !== "ADMIN") {
      window.location.href = "/"
      return
    }

    fetchAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-10 text-gray-600">Loading analytics...</div>
  }

  const allowedCount =
    data.statusBreakdown.find((s) => s.status === "ALLOWED")?.count || 0

  const blockedCount =
    data.statusBreakdown.find((s) => s.status === "BLOCKED")?.count || 0

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* ===== TOP STATS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Stat title="Total Requests" value={data.totalRequests} />
            <Stat title="Last 7 Days" value={data.last7Days} />
            <Stat title="Allowed" value={allowedCount} variant="green" />
            <Stat title="Blocked" value={blockedCount} variant="red" />
          </div>

          {/* ===== ENDPOINT USAGE ===== */}
          <TableCard title="Endpoint Usage">
            <div className="grid grid-cols-3 gap-8 text-xs font-semibold text-gray-500 border-b pb-2">
              <div>Endpoint</div>
              <div>Total Requests</div>
            </div>

            {data.endpointUsage.map((e) => (
              <div
                key={e.endpoint}
                className="grid grid-cols-3 gap-8 py-2 text-sm border-b last:border-none items-center"
              >
                <div className="font-medium truncate">{e.endpoint}</div>
                <div className="font-semibold">{e.count}</div>
              </div>
            ))}
          </TableCard>

          {/* ===== PER USER USAGE ===== */}
          <TableCard title="Per User Usage">
            <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-gray-500 border-b pb-2">
              <div>Email</div>
              <div>Total</div>
              <div>Allowed</div>
              <div>Blocked</div>
            </div>

            {data.perUsage.map((u) => (
              <div
                key={u.email}
                className="grid grid-cols-4 gap-4 py-2 text-sm border-b last:border-none items-center"
              >
                <div className="truncate">{u.email}</div>

                <div className="font-medium">{u.total_requests}</div>

                <div className="bg-green-50 text-green-700 px-2 py-1 rounded-md w-fit">
                  {u.allowed}
                </div>

                <div className="bg-red-50 text-red-700 px-2 py-1 rounded-md w-fit">
                  {u.blocked}
                </div>
              </div>
            ))}
          </TableCard>
        </motion.div>
      </div>
    </>
  )
}

/* ================= UI PARTS ================= */

const Stat = ({ title, value, variant = "neutral" }) => {
  const styles = {
    neutral: "bg-white",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  }

  return (
    <Card className={styles[variant]}>
      <CardContent className="p-4">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

const TableCard = ({ title, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">{children}</CardContent>
  </Card>
)
