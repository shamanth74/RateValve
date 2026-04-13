import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, ShieldOff, Eye, ChevronDown } from "lucide-react"

import Navbar from "@/components/Navbar"
import UserDetailModal from "@/components/UserDetailModal"
import {
  fetchAnalytics,
  fetchAllUsers,
  updateUserTier,
  blockUser,
  unblockUser,
} from "@/api/admin.api"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null) // userId being acted on

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || user.role !== "ADMIN") {
      window.location.href = "/"
      return
    }

    Promise.all([fetchAnalytics(), fetchAllUsers()])
      .then(([analyticsRes, usersRes]) => {
        setData(analyticsRes.data)
        setUsers(usersRes.data.users)
      })
      .finally(() => setLoading(false))
  }, [])

  const refreshUsers = async () => {
    const res = await fetchAllUsers()
    setUsers(res.data.users)
  }

  const handleTierChange = async (userId, newTier) => {
    setActionLoading(userId)
    try {
      await updateUserTier(userId, newTier)
      await refreshUsers()
    } catch (err) {
      console.error("Tier change failed:", err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBlockToggle = async (userId, isCurrentlyBlocked) => {
    setActionLoading(userId)
    try {
      if (isCurrentlyBlocked) {
        await unblockUser(userId)
      } else {
        await blockUser(userId)
      }
      await refreshUsers()
    } catch (err) {
      console.error("Block toggle failed:", err)
    } finally {
      setActionLoading(null)
    }
  }

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

          {/* ===== USER MANAGEMENT ===== */}
          <TableCard title="User Management">
            <div className="grid grid-cols-7 gap-4 text-xs font-semibold text-gray-500 border-b pb-2">
              <div className="col-span-2">Email</div>
              <div>Tier</div>
              <div>Requests</div>
              <div>Blocked</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {users.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No users found</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-7 gap-4 py-3 text-sm border-b last:border-none items-center"
                >
                  {/* Email */}
                  <div className="col-span-2 truncate font-medium">
                    {u.email}
                  </div>

                  {/* Tier dropdown */}
                  <div>
                    <div className="relative inline-block">
                      <select
                        value={u.tier}
                        onChange={(e) => handleTierChange(u.id, e.target.value)}
                        disabled={actionLoading === u.id}
                        className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          u.tier === "PRO"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <option value="FREE">FREE</option>
                        <option value="PRO">PRO</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Total requests */}
                  <div className="font-medium">{u.total_requests}</div>

                  {/* Blocked requests */}
                  <div className="bg-red-50 text-red-700 px-2 py-1 rounded-md w-fit text-xs font-semibold">
                    {u.blocked_requests}
                  </div>

                  {/* Status badge */}
                  <div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        u.is_blocked
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {u.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockToggle(u.id, u.is_blocked)}
                      disabled={actionLoading === u.id}
                      className={`text-xs ${
                        u.is_blocked
                          ? "text-green-600 hover:text-green-700"
                          : "text-red-600 hover:text-red-700"
                      }`}
                    >
                      {u.is_blocked ? (
                        <ShieldOff className="h-3.5 w-3.5" />
                      ) : (
                        <Shield className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUserId(u.id)}
                      className="text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TableCard>

          {/* ===== PER USER USAGE (existing) ===== */}
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

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  )
}

/* ================= UI PARTS (unchanged from original) ================= */

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
