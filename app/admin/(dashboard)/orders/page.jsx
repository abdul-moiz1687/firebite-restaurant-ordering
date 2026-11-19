
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  preparing: "bg-purple-50 text-purple-700",
  ready: "bg-cyan-50 text-cyan-700",
  out_for_delivery: "bg-orange-50 text-orange-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const money = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function formatDate(value) {
  if (!value) return "Date unavailable";

  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
        statusColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {(status || "unknown").replaceAll("_", " ")}
    </span>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const loadOrders = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);

    try {
      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load orders.");
      }

      setOrders(result.orders || []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadOrders(), 0);
    return () => clearTimeout(timer);
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        (order.customer?.fullName || "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (order.customer?.phone || "").includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesType =
        typeFilter === "all" || order.orderType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, search, statusFilter, typeFilter]);

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId);

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Status update failed.");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, status: result.status }
            : order
        )
      );

      setSelectedOrder((current) =>
        current?.id === orderId
          ? { ...current, status: result.status }
          : current
      );
    } catch (err) {
      window.alert(err.message || "Unable to update status.");
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure? This order will be permanently deleted from the database. This action cannot be undone."
    );

    if (!confirmed) return;

    setUpdatingId(orderId);

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete order.");
      }

      setOrders((current) =>
        current.filter((order) => order.id !== orderId)
      );

      setSelectedOrder(null);
    } catch (err) {
      window.alert(err.message || "Unable to delete order.");
    } finally {
      setUpdatingId("");
    }
  }

  async function handleLogout() {
    const response = await fetch("/api/admin/session", {
      method: "DELETE",
    });

    if (response.ok) {
    router.replace("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-[#251f1b] md:flex">
      <aside className="flex w-full flex-col bg-[#211b18] p-5 text-white md:min-h-screen md:w-64">
        <Link href="/admin" className="text-2xl font-black tracking-tight">
          FIRE<span className="text-[#f16a45]">BITE</span>
        </Link>

        <p className="mt-1 text-[10px] font-bold tracking-[.25em] text-white/40">
          RESTAURANT ADMIN
        </p>

        <nav className="mt-10 flex gap-2 md:flex-col">
          <Link
            href="/admin"
            className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <Link
            href="/admin/orders"
            className="flex flex-1 items-center gap-3 rounded-xl bg-[#df4428] px-4 py-3 text-sm font-bold"
          >
            <ClipboardList size={18} />
            Orders
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white md:mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#df4428]">
              Firebite management
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[#968a80]">
              Manage customer orders and update their progress.
            </p>
          </div>

          <button
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#e9e0d7] bg-white px-4 py-3 text-sm font-bold shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        <section className="rounded-2xl border border-[#eee7e0] bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_190px_160px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3978d]"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order ID, customer or phone..."
                className="w-full rounded-xl border border-[#e9e0d7] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#df4428]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#e9e0d7] bg-white px-3 py-3 text-sm outline-none focus:border-[#df4428]"
            >
              <option value="all">All statuses</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-[#e9e0d7] bg-white px-3 py-3 text-sm outline-none focus:border-[#df4428]"
            >
              <option value="all">All order types</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm font-bold">All Orders</p>

            <p className="text-xs text-[#968a80]">
              {filteredOrders.length} orders
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3 py-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-[#f5f1ed]"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag
                size={38}
                className="mx-auto text-[#c7b9ae]"
              />

              <h2 className="mt-4 font-bold">No orders found</h2>

              <p className="mt-2 text-sm text-[#968a80]">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredOrders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-[#eee7e0] p-4 transition hover:border-[#e8b7a8]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="min-w-0 text-left"
                    >
                      <p className="break-all text-xs font-bold text-[#df4428]">
                        #{order.id}
                      </p>

                      <h3 className="mt-1 text-base font-extrabold">
                        {order.customer?.fullName || "Customer"}
                      </h3>

                      <p className="mt-1 text-xs text-[#968a80]">
                        {order.customer?.phone || "No phone"} ·{" "}
                        {order.orderType}
                      </p>
                    </button>

                    <div className="text-right">
                      <p className="font-black">
                        {money(order.subtotal)}
                      </p>

                      <p className="mt-1 text-xs text-[#968a80]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0eae4] pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={order.status} />

                      <span className="text-xs text-[#968a80]">
                        {(order.items || []).reduce(
                          (total, item) =>
                            total + (Number(item.quantity) || 0),
                          0
                        )}{" "}
                        items
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={order.status || "pending"}
                        disabled={updatingId === order.id}
                        onChange={(event) =>
                          updateStatus(order.id, event.target.value)
                        }
                        className="max-w-44 rounded-lg border border-[#e9e0d7] bg-white px-3 py-2 text-xs font-bold outline-none focus:border-[#df4428]"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        disabled={updatingId === order.id}
                        title="Delete permanently"
                        className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="mt-3 text-xs font-bold text-[#df4428] hover:underline"
                  >
                    View full order details →
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#df4428]">
                  Order details
                </p>

                <h2 className="mt-2 break-all text-xl font-black">
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-[#f5f1ed] p-2"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#faf7f3] p-4">
                <p className="text-xs text-[#968a80]">Customer</p>

                <p className="mt-1 font-bold">
                  {selectedOrder.customer?.fullName || "Customer"}
                </p>

                <p className="mt-1 text-sm text-[#756a61]">
                  {selectedOrder.customer?.phone || "No phone"}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf7f3] p-4">
                <p className="text-xs text-[#968a80]">Order information</p>

                <p className="mt-1 font-bold capitalize">
                  {selectedOrder.orderType}
                </p>

                <p className="mt-1 text-sm text-[#756a61]">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {selectedOrder.orderType === "delivery" && (
              <div className="mt-4 rounded-xl border border-[#eee7e0] p-4">
                <p className="text-xs font-bold text-[#968a80]">
                  DELIVERY INFORMATION
                </p>

                <p className="mt-2 text-sm font-bold">
                  {selectedOrder.delivery?.areaName || "Delivery area"}
                </p>

                <p className="mt-1 text-sm text-[#756a61]">
                  {selectedOrder.delivery?.address || "No address provided"}
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-black">Ordered items</h3>

              <div className="mt-3 divide-y divide-[#eee7e0]">
                {(selectedOrder.items || []).map((item, index) => (
                  <div
                    key={`${item.productId || item.name}-${index}`}
                    className="flex justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>

                      <p className="mt-1 text-xs text-[#968a80]">
                        {item.quantity} × {money(item.unitPrice)}
                      </p>
                    </div>

                    <p className="text-sm font-bold">
                      {money(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t border-[#eee7e0] pt-4">
                <span className="font-bold">Order subtotal</span>

                <span className="text-lg font-black">
                  {money(selectedOrder.subtotal)}
                </span>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="mt-5 rounded-xl bg-[#faf7f3] p-4">
                <p className="text-xs font-bold text-[#968a80]">
                  CUSTOMER NOTES
                </p>

                <p className="mt-2 text-sm">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="mt-6 border-t border-[#eee7e0] pt-5">
              <p className="mb-3 text-xs font-bold text-[#968a80]">
                UPDATE ORDER STATUS
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedOrder.status} />

                <select
                  value={selectedOrder.status || "pending"}
                  disabled={updatingId === selectedOrder.id}
                  onChange={(event) =>
                    updateStatus(selectedOrder.id, event.target.value)
                  }
                  className="flex-1 rounded-xl border border-[#e9e0d7] bg-white px-3 py-3 text-sm font-bold outline-none focus:border-[#df4428]"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {updatingId === selectedOrder.id && (
                <p className="mt-2 text-xs text-[#968a80]">
                  Saving changes...
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => deleteOrder(selectedOrder.id)}
                disabled={updatingId === selectedOrder.id}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Delete Permanently
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-[#211b18] px-5 py-3 text-sm font-bold text-white"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}