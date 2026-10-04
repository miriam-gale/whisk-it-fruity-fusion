"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Eye, EyeOff, RefreshCw, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import type { Order } from "@/lib/types";
import NewOrderNotification from "@/components/NewOrderNotification";

type StatusFilter = "all" | "new" | "paid" | "processing" | "completed" | "cancelled";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  new: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-600",
};

const NOTIFIED_STORAGE_KEY = "wif_notified_orders";
const POLL_INTERVAL_MS = 15_000;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("all");

  // Notification state and refs
  const [pendingNotifications, setPendingNotifications] = useState<Order[]>([]);
  const notifiedIdsRef = useRef<Set<string>>(new Set());
  const isFirstFetchRef = useRef(true);

  // Restore previously-seen order IDs so we don't re-notify on page refresh
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(NOTIFIED_STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        notifiedIdsRef.current = new Set(ids);
      }
    } catch { /* ignore parse errors */ }
  }, []);

  // Auth check on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = sessionStorage.getItem("admin_token") || "";
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem("admin_auth");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await res.json();
      const fetchedOrders: Order[] = data.orders || [];
      setOrders(fetchedOrders);

      if (isFirstFetchRef.current) {
        // Seed all currently-paid orders as already notified so we don't fire
        // popups for orders that were paid before the admin opened the page.
        fetchedOrders.forEach((o) => {
          if (o.payment_status === "paid") notifiedIdsRef.current.add(o.id);
        });
        try {
          sessionStorage.setItem(
            NOTIFIED_STORAGE_KEY,
            JSON.stringify([...notifiedIdsRef.current])
          );
        } catch { /* ignore quota errors */ }
        isFirstFetchRef.current = false;
      } else {
        // Subsequent polls: surface any newly-paid orders the admin hasn't seen yet.
        const freshPaid = fetchedOrders.filter(
          (o) => o.payment_status === "paid" && !notifiedIdsRef.current.has(o.id)
        );
        if (freshPaid.length > 0) {
          freshPaid.forEach((o) => notifiedIdsRef.current.add(o.id));
          try {
            sessionStorage.setItem(
              NOTIFIED_STORAGE_KEY,
              JSON.stringify([...notifiedIdsRef.current])
            );
          } catch { /* ignore quota errors */ }

          setPendingNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id));
            return [...prev, ...freshPaid.filter((o) => !existingIds.has(o.id))];
          });

          // Optional browser notification — only if the user already granted permission,
          // never prompts for permission.
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted" &&
            freshPaid[0]
          ) {
            const o = freshPaid[0];
            const firstItem = Array.isArray(o.items)
              ? (o.items as { drinkName: string; quantity: number }[])[0]
              : null;
            try {
              new Notification("New Whisk It Order 🔔", {
                body: firstItem
                  ? `${o.customer_name} ordered ${firstItem.quantity}× ${firstItem.drinkName} — GH₵${o.total_amount}`
                  : `${o.customer_name} — GH₵${o.total_amount}`,
                icon: "/logo.png",
              });
            } catch { /* browser may block silent; ignore */ }
          }
        }
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated, fetchOrders]);

  // Poll every 15 s while authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, fetchOrders]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_token", password);
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid password. Please try again.");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
    isFirstFetchRef.current = true;
    setPendingNotifications([]);
    setIsAuthenticated(false);
    setPassword("");
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const authToken = sessionStorage.getItem("admin_token") || "";
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id: orderId, order_status: newStatus }),
      });
      if (res.ok) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch {
      toast.error("Update failed");
    }
  }

  function dismissNotification() {
    setPendingNotifications((prev) => prev.slice(1));
  }

  function handleViewOrder() {
    fetchOrders();
    setFilter("paid");
    setPendingNotifications((prev) => prev.slice(1));
    setTimeout(() => {
      document
        .getElementById("orders-table")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "paid") return o.payment_status === "paid";
    return o.order_status === filter;
  });

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.order_status === "new").length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    processing: orders.filter((o) => o.order_status === "processing").length,
    completed: orders.filter((o) => o.order_status === "completed").length,
    cancelled: orders.filter((o) => o.order_status === "cancelled").length,
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "linear-gradient(135deg, #fff8f0 0%, #fce4e4 100%)",
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1
              className="text-2xl font-bold text-[#1a0808]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Admin Access
            </h1>
            <p className="text-gray-500 text-sm mt-1">Whisk It Fruity Fusion</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1a1a] focus:border-transparent"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {loginError && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                  {loginError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-[#8b1a1a] hover:bg-[#6b1212] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loginLoading ? "Logging in…" : "Log In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New order notification — renders above all dashboard content */}
      {pendingNotifications.length > 0 && (
        <NewOrderNotification
          key={pendingNotifications[0].id}
          order={pendingNotifications[0]}
          queueLength={pendingNotifications.length}
          onDismiss={dismissNotification}
          onViewOrder={handleViewOrder}
        />
      )}

      {/* Admin Header */}
      <div className="bg-[#1a0808] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Whisk It Admin
            </h1>
            <p className="text-red-300 text-xs">Order Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {(Object.keys(counts) as StatusFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl text-left transition-all ${
                filter === key
                  ? "bg-[#8b1a1a] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-100"
              }`}
            >
              <p
                className={`text-2xl font-bold ${
                  filter === key ? "text-white" : "text-[#8b1a1a]"
                }`}
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {counts[key]}
              </p>
              <p
                className={`text-xs mt-1 capitalize ${
                  filter === key ? "text-red-200" : "text-gray-500"
                }`}
              >
                {key === "all" ? "Total Orders" : key}
              </p>
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div
          id="orders-table"
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-[#1a0808] text-base capitalize">
              {filter === "all" ? "All Orders" : `${filter} Orders`} (
              {filteredOrders.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw size={24} className="animate-spin text-[#8b1a1a]" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-400 text-sm">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        order.payment_status === "paid" &&
                        order.order_status === "new"
                          ? "bg-green-50/40"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 whitespace-nowrap">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        {Array.isArray(order.items) &&
                          order.items.map(
                            (item: { drinkName: string; quantity: number }, i: number) => (
                              <span key={i} className="block text-xs text-gray-600">
                                {item.quantity}× {item.drinkName}
                              </span>
                            )
                          )}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#8b1a1a] whitespace-nowrap">
                        GH₵{order.total_amount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            statusColors[order.payment_status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            statusColors[order.order_status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-GH", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] bg-white"
                        >
                          <option value="new">New</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
